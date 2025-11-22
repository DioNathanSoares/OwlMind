// Utilidades
const qs = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>[...el.querySelectorAll(s)];
const storage = { get:k=>JSON.parse(localStorage.getItem(k)||'null'), set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)) };

// Inicialização por página
window.addEventListener('DOMContentLoaded',()=>{
  const page = document.body.dataset.page;
  if(page==='home') initHome();
  if(page==='signup') initSignup();
  if(page==='subjects') initSubjects();
  if(page==='quiz') initQuiz();
  if(page==='result') initResult();
});

/* ---------------- HOME ---------------- */
function initHome(){
  // Login simples (demo) usando localStorage
  const form = qs('#login-form');
  const alertBox = qs('#login-alert');
  qs('#signup-btn').addEventListener('click',()=>location.href='signup.html');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const emailOrUser = qs('#usuario').value.trim().toLowerCase();
    const pass = qs('#senha').value;
    const users = storage.get('owlmind_users')||[];
    const user = users.find(u => (u.email===emailOrUser || u.name?.toLowerCase()===emailOrUser || u.nickname?.toLowerCase()===emailOrUser) && u.pass===pass);
    if(!user){
      showAlert(alertBox,'err','Credenciais inválidas.');
      return;
    }
    storage.set('owlmind_session',{email:user.email,name:user.name||user.nickname||'Usuário'});
    location.href='subjects.html';
  });

  // Carrossel
  initCarousel();
}

function showAlert(el,type,msg){
  el.classList.remove('ok','err');
  el.classList.add(type==='ok'?'ok':'err');
  el.textContent = msg; el.hidden=false;
}

/* ---------------- SIGNUP ---------------- */
function initSignup(){
  const form = qs('#signup-form');
  const alertBox = qs('#signup-alert');
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = qs('#nome').value.trim();
    const email = qs('#email').value.trim().toLowerCase();
    const nickname = qs('#apelido').value.trim();
    const pass = qs('#senhaCadastro').value;

    const users = storage.get('owlmind_users')||[];
    if(users.some(u=>u.email===email)) return showAlert(alertBox,'err','Este e-mail já está cadastrado.');
    if(pass.length<6) return showAlert(alertBox,'err','A senha deve ter pelo menos 6 caracteres.');

    users.push({name,email,nickname,pass});
    storage.set('owlmind_users', users);
    showAlert(alertBox,'ok','Conta criada! Redirecionando para login...');
    setTimeout(()=>location.href='index.html', 800);
  });
}

/* ---------------- SUBJECTS ---------------- */
async function initSubjects(){
  const container = qs('#subject-cards');
  try{
    const res = await fetch('assets/data/perguntas.json');
    const data = await res.json();
    const subjects = [
      {id:'esporte', label:'Esporte'},
      {id:'lazer', label:'Lazer'},
      {id:'cultura', label:'Cultura'},
      {id:'tecnologia', label:'Tecnologia'}
    ];
    container.innerHTML='';
    subjects.forEach(sub=>{
      const count = (data[sub.id]||[]).length;
      const card = document.createElement('button');
      card.className='subject-card';
      card.innerHTML = `<strong>${sub.label}</strong><br><small>${count} perguntas</small>`;
      card.addEventListener('click',()=>{ localStorage.setItem('assuntoSelecionado', sub.id); location.href='quiz.html'; });
      container.appendChild(card);
    });
  }catch(err){
    container.innerHTML = '<p>Falha ao carregar os assuntos. Verifique o arquivo perguntas.json.</p>';
  }
}

/* ---------------- CARROSSEL ---------------- */
function initCarousel(){
  const items = qsa('.carousel-item');
  const dots = qsa('.dot');
  let current = 0; let timer;
  const show = (idx)=>{
    items.forEach((el,i)=>el.classList.toggle('active', i===idx));
    dots.forEach((d,i)=>d.classList.toggle('active', i===idx));
    current = idx;
  };
  const next = ()=> show((current+1)%items.length);
  const start = ()=> timer = setInterval(next, 5000);
  const stop = ()=> clearInterval(timer);

  dots.forEach(d=>{
    d.addEventListener('click', ()=>{ stop(); show(Number(d.dataset.idx)); start(); });
  });
  show(0); start();
}

/* ---------------- QUIZ ---------------- */
async function initQuiz(){
  const subjectId = localStorage.getItem('assuntoSelecionado');
  if(!subjectId){ location.href='subjects.html'; return; }
  const res = await fetch('assets/data/perguntas.json');
  const data = await res.json();
  const list = data[subjectId]||[];
  if(!list.length){ qs('#question-text').textContent='Sem perguntas para este assunto.'; return; }

  const titleMap = {esporte:'Esporte', lazer:'Lazer', cultura:'Cultura', tecnologia:'Tecnologia'};
  qs('#quiz-title').textContent = `Quiz: ${titleMap[subjectId]||subjectId}`;

  let idx=0, score=0, chosenIndex=null;
  let answered = false;

qs('#quit-btn').addEventListener('click', () => {
  qs('#quit-modal').hidden = false;
});

qs('#quit-yes').addEventListener('click', () => {
  qs('#quit-modal').hidden = true;
  quitGame();
});

qs('#quit-no').addEventListener('click', () => {
  qs('#quit-modal').hidden = true;
});

function quitGame() {
  const total = list.length;
  storage.set('resultadoQuiz', { acertos: score, total, status: 'desistiu' });
  location.href = 'subjects.html';
}

const render = ()=>{
    answered = false;
    const q = list[idx];
    qs('#question-text').textContent = q.pergunta;
    const ul = qs('#options-list');

    ul.classList.remove('locked');
    ul.innerHTML = '';
    (q.alternativas||[]).forEach((opt,i)=>{
      const li = document.createElement('li');
      li.textContent = opt; li.tabIndex=0; li.setAttribute('role','button');

      li.addEventListener('click',()=> choose(i));
      li.addEventListener('keydown',ev=>{ if(ev.key==='Enter') choose(i); });

      ul.appendChild(li);
    });

    qs('#hint-area').hidden = true; qs('#hint-area').textContent = q.dica||'';
    qs('#feedback').textContent='';
    qs('#next-btn').disabled = true; chosenIndex=null;
    updateProgress();
  };

  const choose = (i)=>{
    if (answered) return;
    chosenIndex = i;
    openConfirm();
  };

  qs('#hint-btn').addEventListener('click',()=>{ qs('#hint-area').hidden = !qs('#hint-area').hidden; });

  qs('#next-btn').addEventListener('click',()=>{
    if(idx < list.length-1){ idx++; render(); }
    else finish();
  });

  const modal = qs('#confirm-modal');
  qs('#confirm-yes').addEventListener('click',()=>{ modal.hidden=true; validate(); });
  qs('#confirm-no').addEventListener('click',()=>{ modal.hidden=true; });
  function openConfirm(){ modal.hidden=false; }

  function validate(){
    const q = list[idx];
    const correctIndex = ['a','b','c','d'].indexOf(String(q.resposta).toLowerCase());
    const ul = qs('#options-list');
    const nodes = qsa('#options-list li');

    nodes.forEach((li,i)=>{
      li.style.borderColor = (i===correctIndex)?'var(--ok)':'#ddd';
      if(i===chosenIndex && i!==correctIndex) li.style.borderColor='var(--warn)';
    });

    const ok = (chosenIndex===correctIndex);
    if(ok) score++;

    qs('#feedback').textContent = ok ? '✔ Resposta correta!' : '✖ Resposta incorreta.';
    qs('#next-btn').disabled = false;
   
    answered = true;
    ul.classList.add('locked'); 
  }

  function updateProgress(){
    const pct = Math.round((idx / list.length)*100);
    qs('#progress-bar').style.width = pct+'%';
  }

  function finish(){
    const total = list.length; const pct = Math.round((score/total)*100);
    storage.set('resultadoQuiz',{acertos:score,total});
    location.href = pct>=60 ? 'result.html?status=ganhou' : 'result.html?status=perdeu';
  }

  render();
}

/* ---------------- RESULT ---------------- */
function initResult(){
  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  const res = storage.get('resultadoQuiz')||{acertos:0,total:0};
  const pct = res.total? Math.round((res.acertos/res.total)*100) : 0;
  qs('#result-summary').textContent = `Você acertou ${res.acertos} de ${res.total} (${pct}%).`;
  if(status==='ganhou'){
    qs('#result-title').textContent='Parabéns!';
    qs('#result-owl').src='assets/img/Corujinha_vitoriosa.png';
  }else{
    qs('#result-title').textContent='Não foi dessa vez!';
    qs('#result-owl').src='assets/img/Corujinha_desanimada.png';
  }
  
  qs('#play-again').addEventListener('click', (e)=>{ e.preventDefault(); location.href='quiz.html'; });
}