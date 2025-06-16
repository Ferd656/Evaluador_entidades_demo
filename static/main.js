let data = [];
let keys = [];
let currentIndex = 0;
let componentsShown = false;

function notaColor(nota) {
    let r, g, b = 60;
    if (nota <= 50) {
        r = 255;
        g = Math.round(255 * (nota / 50));
    } else {
        r = Math.round(255 * (1 - (nota - 50) / 50));
        g = 255;
    }
    return `rgb(${r},${g},${b})`;
}

function computeTotalScore(componentes) {
    return componentes.reduce((acc, c) => acc + c.nota * c.ponderador, 0).toFixed(2);
}

function showItem(idx) {
    componentsShown = false;
    const visual = document.getElementById('visual-area');
    visual.innerHTML = '';
    const itemKey = keys[idx];
    const item = data[itemKey];
    const totalScore = computeTotalScore(item.componentes);
    const titleDiv = document.createElement('div');
    titleDiv.className = 'visual-title';
    titleDiv.innerHTML = `
        <span>${itemKey}</span>
        <span class="visual-score" style="background:${notaColor(totalScore)}">${totalScore}</span>
    `;
    visual.appendChild(titleDiv);
    titleDiv.style.cursor = 'pointer';
    titleDiv.title = 'Haz clic para ver los componentes';
    titleDiv.onclick = () => showComponents(idx);
    const hint = document.createElement('div');
    hint.style.marginTop = '30px';
    hint.style.fontSize = '1.2rem';
    hint.style.color = '#888';
    hint.innerText = 'Haz clic en el título para ver los componentes.';
    visual.appendChild(hint);
}

function showComponents(idx) {
    if (componentsShown) return;
    componentsShown = true;
    const visual = document.getElementById('visual-area');
    visual.innerHTML = '';
    const itemKey = keys[idx];
    const item = data[itemKey];
    const totalScore = computeTotalScore(item.componentes);
    const titleDiv = document.createElement('div');
    titleDiv.className = 'visual-title';
    titleDiv.innerHTML = `
        <span>${itemKey}</span>
        <span class="visual-score" style="background:${notaColor(totalScore)}">${totalScore}</span>
    `;
    visual.appendChild(titleDiv);

    const list = document.createElement('div');
    list.className = 'component-list';

    item.componentes.forEach((comp, i) => {
        const compDiv = document.createElement('div');
        compDiv.className = 'component-item';

        const compTitle = document.createElement('div');
        compTitle.className = 'component-title';
        compTitle.innerHTML = `
            <span>${comp.nombre}</span>
            <span class="component-score" style="background:${notaColor(comp.nota)}">${comp.nota}</span>
        `;
        compDiv.appendChild(compTitle);

        const comment = document.createElement('div');
        comment.className = 'component-comment';
        comment.id = `comment-${i}`;
        compDiv.appendChild(comment);

        list.appendChild(compDiv);

        setTimeout(() => typeText(`comment-${i}`, comp.comentario), 500 * i);
    });

    visual.appendChild(list);
}

function typeText(elementId, text, i = 0) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (i < text.length) {
        el.innerHTML += text[i];
        setTimeout(() => typeText(elementId, text, i + 1), 18);
    }
}

function nextItem() {
    currentIndex = (currentIndex + 1) % keys.length;
    showItem(currentIndex);
}
function prevItem() {
    currentIndex = (currentIndex - 1 + keys.length) % keys.length;
    showItem(currentIndex);
}

async function runMainPy() {
    document.getElementById('loading-overlay').style.display = 'flex';
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);

    try {
        const res = await fetch('/run-main', { method: 'POST' });
       if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.output || 'Error ejecutando main.py');
        }
        const dataRes = await fetch('/data');
        data = await dataRes.json();
        keys = Object.keys(data);
        currentIndex = 0;
        showItem(currentIndex);
    } catch (e) {
        print(str(e))
        alert('Hubo un error ejecutando main.py');
    } finally {
        document.getElementById('loading-overlay').style.display = 'none';
        document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    }
}

window.onload = async function() {
    const res = await fetch('/data');
    data = await res.json();
    keys = Object.keys(data);
    if (keys.length === 0) {
        document.getElementById('visual-area').innerHTML = '';
    } else {
        showItem(currentIndex);
    }

    document.getElementById('next-btn').onclick = nextItem;
    document.getElementById('back-btn').onclick = prevItem;
    document.getElementById('play-btn').onclick = runMainPy;
};