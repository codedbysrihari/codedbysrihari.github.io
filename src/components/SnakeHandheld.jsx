import { useEffect, useReducer, useRef } from 'react';
import './handheld.css';

const width = 20;
const height = 12;
const directions = {
  up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0]
};
const opposite = { up: 'down', right: 'left', down: 'up', left: 'right' };
const keys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
const glyphs = {
  S: ['11111','10000','10000','11111','00001','00001','11111'],
  N: ['10001','11001','11001','10101','10011','10011','10001'],
  A: ['01110','10001','10001','11111','10001','10001','10001'],
  K: ['10001','10010','10100','11000','10100','10010','10001'],
  E: ['11111','10000','10000','11110','10000','10000','11111']
};

function newGame(mode = 'ready') {
  return { mode, body: [[5,6],[4,6],[3,6],[2,6]], food: [9,6], direction: 'right', queue: [], score: 0 };
}

function move(game, seed) {
  const direction = game.queue[0] || game.direction;
  const [dx, dy] = directions[direction];
  const [x, y] = [game.body[0][0] + dx, game.body[0][1] + dy];
  const ate = x === game.food[0] && y === game.food[1];
  const rest = ate ? game.body : game.body.slice(0,-1);
  if (x < 0 || x >= width || y < 0 || y >= height || rest.some(([a,b]) => a === x && b === y)) {
    return { ...game, mode: 'over' };
  }
  const body = [[x,y], ...rest];
  let food = game.food;
  if (ate) {
    const empty = [];
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (!body.some(([a,b]) => a === col && b === row)) empty.push([col,row]);
      }
    }
    if (!empty.length) return { ...game, body, mode: 'won', score: game.score + 1 };
    food = empty[Math.floor(seed * empty.length)];
  }
  return { ...game, direction, queue: game.queue.slice(1), body, food, score: game.score + Number(ate) };
}

function gameReducer(game, action) {
  switch (action.type) {
    case 'toggle':
      if (game.mode === 'playing') return { ...game, mode: 'paused' };
      return game.mode === 'paused' ? { ...game, mode: 'playing' } : newGame('playing');
    case 'reset': return newGame();
    case 'pause': return game.mode === 'playing' ? { ...game, mode: 'paused' } : game;
    case 'direction': {
      const last = game.queue.at(-1) || game.direction;
      if (game.mode !== 'playing' || game.queue.length >= 2 || action.value === last || action.value === opposite[last]) return game;
      return { ...game, queue: [...game.queue, action.value] };
    }
    case 'tick': return game.mode === 'playing' ? move(game, action.seed) : game;
    default: return game;
  }
}

function drawScreen(canvas, game) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2b3b29';
  if (game.mode === 'ready') {
    [...'SNAKE'].forEach((letter, i) => glyphs[letter].forEach((line, y) => {
      [...line].forEach((pixel, x) => { if (pixel === '1') ctx.fillRect(44 + i*36+x*6, 17+y*6, 6, 6); });
    }));
    const trail = [[0,2],[1,2],[2,2],[2,1],[2,0],[3,0],[4,0],[5,0],[5,1],[5,2],[6,2],[7,2]];
    for (const [x,y] of trail) ctx.fillRect(54+x*9,77+y*9,8,8);
    ctx.clearRect(54+7*9+5,77+2*9+1,2,2);
    ctx.fillRect(188,88,9,9); ctx.fillRect(192,84,4,4);
    return;
  }
  for (const [x,y] of game.body) ctx.fillRect(11+x*12,5+y*12,11,11);
  const [fx,fy] = game.food;
  ctx.fillRect(14+fx*12,8+fy*12,7,7);
  ctx.fillRect(17+fx*12,5+fy*12,3,4);
  ctx.lineWidth=1;
  ctx.strokeRect(8.5,2.5,width*12+4,height*12+4);
}

const actionNames = { ready: 'Start Snake', playing: 'Pause game', paused: 'Resume game', over: 'Play again', won: 'Play again' };
const prompts = { ready: 'PRESS A TO PLAY', playing: '', paused: 'PAUSED', over: 'GAME OVER', won: 'BOARD CLEARED' };

export default function SnakeHandheld() {
  const [game, dispatch] = useReducer(gameReducer, null, () => newGame());
  const stage = useRef(null);
  const device = useRef(null);
  const screen = useRef(null);
  const touch = useRef(null);
  const swiped = useRef(false);
  const playing = game.mode === 'playing';

  useEffect(() => { drawScreen(screen.current, game); }, [game]);
  useEffect(() => {
    if (!playing) return;
    const clock = setInterval(() => dispatch({ type: 'tick', seed: Math.random() }), 235);
    return () => clearInterval(clock);
  }, [playing]);
  useEffect(() => {
    const target = stage.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) dispatch({ type: 'pause' });
    });
    function pause() { dispatch({ type: 'pause' }); }
    function visibility() { if (document.hidden) pause(); }
    observer.observe(target);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', pause);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', pause);
    };
  }, []);
  useEffect(() => {
    const target = stage.current;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    function update() {
      frame = 0;
      const turn = motion.matches ? 0 : Math.min(1, Math.max(0, window.scrollY / (target.offsetHeight || 1)));
      target.style.setProperty('--scroll-turn', turn * 12 + 'deg');
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    window.addEventListener('scroll', schedule, { passive: true });
    motion.addEventListener('change', schedule);
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      motion.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  function action(type, value) {
    dispatch({ type, value });
    device.current.focus({ preventScroll: true });
  }
  function keyDown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (keys[event.key] && playing) {
      event.preventDefault();
      dispatch({ type: 'direction', value: keys[event.key] });
    } else if (event.key.toLowerCase() === 'a' || ((event.key === ' ' || event.key === 'Enter') && event.target === device.current)) {
      event.preventDefault();
      if (!event.repeat) dispatch({ type: 'toggle' });
    } else if (event.key.toLowerCase() === 'b') dispatch({ type: 'reset' });
    else if (event.key === 'Escape') dispatch({ type: 'pause' });
  }
  function swipe(event) {
    if (!touch.current) return;
    const dx = event.clientX - touch.current[0], dy = event.clientY - touch.current[1];
    touch.current = null;
    if (!playing || Math.max(Math.abs(dx),Math.abs(dy)) < 10) return;
    swiped.current = true;
    action('direction', Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }
  function tilt(event) {
    if (event.pointerType !== 'mouse' || playing || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = stage.current.getBoundingClientRect();
    stage.current.style.setProperty('--tilt', (event.clientX - rect.left - rect.width/2) / rect.width * 9 + 'deg');
  }
  return <figure className={'handheld-stage' + (playing ? ' is-playing' : '')} ref={stage}
    onPointerMove={tilt} onPointerLeave={() => stage.current.style.setProperty('--tilt','0deg')}>
    <div className="halftone-disc" aria-hidden="true"/>
    <div className="hardware-position">
      <div className="handheld" ref={device} tabIndex={0} onKeyDown={keyDown}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) dispatch({ type: 'pause' }); }}
        role="group" aria-label="Playable Snake handheld" aria-describedby="snake-hint">
        <div className="case-depth" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--layer': i, '--shade': i>8 && i<11 ? '#777280' : 'hsl(263 8% '+ (48+i*1.5) +'%)' }}/>)}
        </div>
        <div className="case-front">
          <div className="case-seam" aria-hidden="true"/>
          <div className="screen-surround">
            <div className="screen-stripes" aria-hidden="true"/>
            <i className="power-lamp" aria-hidden="true"/>
            <button className={'lcd ' + game.mode} type="button" aria-label={actionNames[game.mode] + ' on screen'}
              onPointerDown={e => { swiped.current = false; touch.current = [e.clientX,e.clientY]; }}
              onPointerUp={swipe} onPointerCancel={() => { touch.current = null; }}
              onClick={() => { if (!swiped.current) action('toggle'); }}>
              <canvas ref={screen} width="262" height="154" aria-hidden="true"/>
              {prompts[game.mode] && <span className="lcd-caption">{prompts[game.mode]}</span>}
              {game.mode !== 'ready' && <span className="lcd-score">SCORE {String(game.score).padStart(2,'0')}</span>}
            </button>
          </div>
          <div className="case-brand" aria-hidden="true">Pocket <b>Snake</b></div>
          <div className="dpad" aria-label="Direction pad">
            {Object.keys(directions).map(dir => <button type="button" key={dir} className={'pad-'+dir}
              onClick={() => action('direction',dir)} aria-label={'Steer '+dir}><i/></button>)}
          </div>
          <div className="round-controls">
            <div><button className="game-key key-b" type="button" aria-label="Reset Snake" onClick={() => action('reset')}/><span aria-hidden="true">B</span></div>
            <div><button className="game-key key-a" type="button" aria-label={actionNames[game.mode]} onClick={() => action('toggle')}/><span aria-hidden="true">A</span></div>
          </div>
          <div className="speaker" aria-hidden="true">{Array.from({length:6},(_,i)=><i key={i}/>)}</div>
          <i className="case-screw" aria-hidden="true"/>
        </div>
      </div>
    </div>
    <figcaption className="handheld-note" id="snake-hint">
      <svg viewBox="0 0 58 49" aria-hidden="true"><path d="M3 4c23-4 42 10 36 20-3 7-12 3-10-4 4-11 24 4 20 23m-6-8 6 9 7-7"/></svg>
      {playing ? 'Arrow keys or swipe!' : game.mode === 'paused' ? 'Press A to resume' : game.mode === 'ready' ? 'Press A to play!' : 'One more round?'}
    </figcaption>
    <span className="sr-only" role="status">{game.mode === 'over' || game.mode === 'won' ? prompts[game.mode] + '. Score ' + game.score : ''}</span>
  </figure>;
}
