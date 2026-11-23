// Deploy this file as a Google Apps Script web app running as the portfolio owner.
const INBOX = 'harikarthikselvam@gmail.com';
const SITE = 'https://codedbysrihari.github.io/';
const DAY = 86400000;

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function escaped_(text) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, c => entities[c]);
}

function digest_(text) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8));
}

function stationery_(heading, contents, reference) {
  return `<!doctype html><html lang="en"><body style="margin:0;background:#eae6da;color:#272923;font-family:Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#eae6da"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf4;border:1px solid #d1cbbb">
<tr><td bgcolor="#252923" style="padding:16px 26px;color:#f6ecd1;font:italic bold 22px Georgia,serif">sk<span style="color:#e8d994">.</span></td></tr>
<tr><td style="padding:28px 26px 22px"><h1 style="margin:0 0 20px;color:#262923;font:normal 34px/1.12 Georgia,serif">${heading}</h1>
<div style="font:16px/1.6 Arial,sans-serif;color:#363a32">${contents}</div></td></tr>
<tr><td style="padding:13px 26px;border-top:1px dashed #c9c4af;font:12px/1.6 Arial,sans-serif;color:#5d614f">
<a style="color:#49513c" href="${SITE}">Srihari K · Portfolio</a> &nbsp; / &nbsp; Note ${reference}</td></tr>
</table></td></tr></table></body></html>`;
}

function notifyOwner_(note, reference) {
  const sender = escaped_(note.name);
  const address = escaped_(note.email);
  const content = `<p style="margin:0">From <strong>${sender}</strong><br><a style="color:#3e5444" href="mailto:${address}">${address}</a></p>
<p style="margin:20px 0;padding:16px;border-left:3px solid #96884b;background:#f3efdf;overflow-wrap:anywhere">${escaped_(note.message).replace(/\r\n|\r|\n/g, '<br>')}</p>
<p style="margin:0">Reply to this email to write directly to the visitor.</p>`;
  MailApp.sendEmail({to: INBOX, name: 'Srihari K · Portfolio', replyTo: note.email,
    subject: 'Portfolio enquiry · ' + reference,
    body: note.name + ' <' + note.email + '>\n\n' + note.message + '\n\nNote ' + reference,
    htmlBody: stationery_('A note from your portfolio', content, reference)});
}

function confirmVisitor_(email, reference) {
  // Keep the acknowledgement authored by Srihari. The visitor's free text belongs in the owner notification.
  const copy = 'Thanks for getting in touch through my portfolio. I received your message and will get back to you soon.';
  const followUp = 'If you have anything to add, you can reply to this email.';
  const referenceLine = 'Your message reference is ' + reference + '.';
  const htmlBody = `<div style="max-width:34em;padding:20px 24px;border-left:3px solid #c9c0a0;color:#292d25;font:16px/1.6 Georgia,serif">
<p style="margin:0 0 14px">${copy}</p><p style="margin:0 0 20px">${followUp}</p>
<p style="margin:0;font:italic 22px Georgia,serif">Srihari K.</p>
<p style="margin:16px 0 0;color:#555b4e;font:13px Arial,sans-serif">${referenceLine}</p></div>`;
  MailApp.sendEmail({to: email, name: 'Srihari K', replyTo: INBOX,
    subject: 'Your message to Srihari K (' + reference + ')',
    body: [copy, followUp, 'Srihari K.', referenceLine].join('\n\n'), htmlBody});
}

// Persist only hashes, progress and timestamps. Retry the unsent half if the receipt fails.
function deliver_(note) {
  const now = Date.now();
  const store = PropertiesService.getScriptProperties();
  const records = store.getProperties();
  const key = 'contact.' + note.id;
  const address = digest_(note.email.toLowerCase());
  const fingerprint = digest_(JSON.stringify([note.name, note.email, note.message]));
  const reference = 'SK-' + note.id.slice(0, 8).toUpperCase();
  let recent = 0;
  let fromAddress = 0;
  let record;
  for (const [id, raw] of Object.entries(records)) {
    if (!id.startsWith('contact.')) continue;
    const entry = JSON.parse(raw);
    if (now - entry.time > 2 * DAY) { store.deleteProperty(id); continue; }
    if (id === key) record = entry;
    if (now - entry.time < 600000) recent++;
    if (now - entry.time < 3600000 && entry.address === address) fromAddress++;
  }
  if (record && record.fingerprint !== fingerprint) return {status:'invalid'};
  if (!record) {
    if (recent >= 12 || fromAddress >= 3) return {status:'limited'};
    if (MailApp.getRemainingDailyQuota() < 2) return {status:'unavailable'};
    record = {time:now, address, fingerprint, stage:'new'};
    store.setProperty(key, JSON.stringify(record));
  }
  if (record.stage === 'new') {
    notifyOwner_(note, reference);
    record.stage = 'owner';
    store.setProperty(key, JSON.stringify(record));
  }
  if (record.stage === 'owner') {
    try { confirmVisitor_(note.email, reference); }
    catch (_) { return {status:'owner', reference}; }
    record.stage = 'complete';
    store.setProperty(key, JSON.stringify(record));
  }
  return {status:'complete', reference};
}

function doPost(event) {
  const p = event && event.parameter || {};
  const note = {id:String(p.id || ''), email:String(p.email || '').trim(), name:String(p.name || '').trim(), message:String(p.message || '').trim()};
  if (p.website || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(note.id) ||
      !note.name || note.name.length > 100 || /[\r\n]/.test(note.name) || !note.message || note.message.length > 4000 ||
      note.email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(note.email)) return json_({status:'invalid'});
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(8000)) return json_({status:'busy'});
  try { return json_(deliver_(note)); }
  catch (_) { return json_({status:'unavailable'}); }
  finally { lock.releaseLock(); }
}
