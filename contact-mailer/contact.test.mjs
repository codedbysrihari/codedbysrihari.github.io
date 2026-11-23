import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('./Code.gs', import.meta.url), 'utf8');

function harness() {
  const mail = [], entries = new Map();
  const services = {
    ContentService: { MimeType: {JSON: 'json'}, createTextOutput: text => ({setMimeType: () => JSON.parse(text)}) },
    Utilities: { DigestAlgorithm: {SHA_256:'sha256'}, Charset: {UTF_8:'utf8'},
      computeDigest: (alg, text) => createHash(alg).update(text).digest(),
      base64EncodeWebSafe: bytes => bytes.toString('base64url') },
    PropertiesService: {getScriptProperties: () => ({
      getProperties: () => Object.fromEntries(entries), setProperty: (key, value) => entries.set(key, value),
      deleteProperty: key => entries.delete(key),
    })},
    LockService: {getScriptLock: () => ({tryLock: () => true, releaseLock() {}})},
    MailApp: { getRemainingDailyQuota: () => 100, sendEmail: email => mail.push(email) },
  };
  const app = vm.createContext(services);
  vm.runInContext(source, app);
  const note = {id:randomUUID(), name:'Jo & Co', email:'jo@example.org', message:'Line one\n<script> & a second line'};
  return {send: (data = note) => app.doPost({parameter:data}), transport: services.MailApp, mail, note};
}

test('sends two distinct, replyable messages and deduplicates replays', () => {
  const {send, mail, note} = harness();
  assert.equal(send().status, 'complete');
  assert.equal(send().status, 'complete');
  assert.equal(mail.length, 2);
  assert.equal(mail[0].to, 'harikarthikselvam@gmail.com');
  assert.equal(mail[0].replyTo, note.email);
  assert.ok(mail[0].body.includes(note.message));
  assert.match(mail[0].htmlBody, /Line one<br>&lt;script&gt;/);
  assert.equal(mail[1].to, note.email);
  assert.equal(mail[1].replyTo, mail[0].to);
  const reference = 'SK-' + note.id.slice(0, 8).toUpperCase();
  assert.ok(mail[1].subject.includes(reference));
  assert.ok(mail[1].body.includes(reference));
  assert.ok(mail[1].htmlBody.includes(reference));
  assert.doesNotMatch(mail[1].htmlBody, /<(?:a|img)\b/i);
  assert.match(mail[1].htmlBody, /get back to you soon/);
  assert.ok(!mail[1].htmlBody.includes('Line one'));
  assert.equal(send({...note, email:'different@example.org'}).status, 'invalid');
});

test('a failed visitor confirmation retries only the missing email', () => {
  const {send, mail, transport} = harness();
  const deliver = transport.sendEmail;
  transport.sendEmail = email => { if (mail.length) throw Error('temporarily unavailable'); deliver(email); };
  assert.equal(send().status, 'owner');
  transport.sendEmail = deliver;
  assert.equal(send().status, 'complete');
  assert.equal(mail.length, 2);
});

test('invalid input, unavailable quota and address limits prevent extra mail', () => {
  const {send, note, mail, transport} = harness();
  for (const edits of [{email:'one@example.org,two@example.org'}, {website:'spam'}, {message:' '}, {name:'a\nb'}, {id:'x'}]) {
    assert.equal(send({...note,...edits}).status, 'invalid');
  }
  transport.getRemainingDailyQuota = () => 1;
  assert.equal(send().status, 'unavailable');
  assert.equal(mail.length, 0);
  transport.getRemainingDailyQuota = () => 100;
  for (let i = 0; i < 3; i++) assert.equal(send({...note, id:randomUUID()}).status, 'complete');
  assert.equal(send({...note, id:randomUUID()}).status, 'limited');
  assert.equal(mail.length, 6);
});
