const btAddTarefa = document.querySelector('.app__button--add-task')
const formAddTarefa = document.querySelector('.app__form-add-task')
const textArea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const btCancelarTarefa = document.querySelector('.app__form-footer__button--cancel')
let tarefaSelecionada = null
let liTarefaSelecionada = null
let tarefasList = JSON.parse(localStorage.getItem('tarefas')) || []       //transforma o json do localStorage em string ou se n tem nd cria uma lista vazia
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')
const btRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btRemoverTodas = document.querySelector('#btn-remover-todas')


function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefasList))
}


btAddTarefa.addEventListener('click', () => {
    formAddTarefa.classList.toggle('hidden')        //api do dom para colocar ou tirar a class hiden
})

formAddTarefa.addEventListener('submit', (evento) => {      //funçao para quando dar submit nao recarregar a pagina
    evento.preventDefault();        //preventDefault tira o comportamento padrao do submit
    // const descricaoTarefa = textArea.value      //value: metodo para pegar o string escrito no textArea
    const tarefa = {
        descricao: textArea.value       //fez isso p/ colocar no db
    }
    tarefasList.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa);         //cria o elemento da lista q foi feito aqui no js
    ulTarefas.append(elementoTarefa);                           //adiciona o li criado na tag ul la do html
    //localStorage.setItem('tarefas', tarefasList)      nesse caso ele guarda um objeto no localStorage, entao precisamos usar a api JSON p/ guardar a string
    atualizarTarefas()
    //os de baixo é para resetar o formulario
    textArea.value = ''
    formAddTarefa.classList.add('hidden')

})

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `

    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')
    //debugger -> metodo debug do js
    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src', '/imagens/edit.png')
    botao.append(imagemBotao)
    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nme da tarefa?")
        console.log('nova descrição da tarefa: ', novaDescricao)        //para debugar 
        if (novaDescricao) {        //se a novaDescricao n for vazia ou null
            paragrafo.textContent = novaDescricao           //adicionar ao paragrafo 
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }


    }

    // adicionar as outras tags no li
    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', true)   //caçar o button de edit do li e desabilitar
    } else {
        li.onclick = () => {
            //zera a classe active da lista
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
            // se ao clicar a tarefa selecionada for igual a tarefa clicada ele zera a classe active
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }

            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            li.classList.add('app__section-task-list-item-active')
        }
    }



    return li
}

// A FUNCAO JS ACIMA TENTA CRIAR UM ELEMENTO HTML COMPLEXO P/ MOSTRAR A LISTA DE TAREFAS NO STORGAE

/*
<li class="app__section-task-list-item">
    <svg>
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    </svg>
    <p class="app__section-task-list-item-description">
        Estudando localStorage
    </p>
    <button class="app_button-edit">
        <img src="/imagens/edit.png">
    </button>
</li>
 */

tarefasList.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});


//=========BOTAO CANCELAR NO ADD TAREFA
btCancelarTarefa.addEventListener('click', () => {
    formAddTarefa.classList.toggle('hidden')
    textArea.value = ''
})

document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', true)   //caçar o button de edit do li e desabilitar
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})




const removerTarefas = (somenteCompletas) => {
    // const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    let seletor = ".app__section-task-list-item"
    if (somenteCompletas) {
        seletor = ".app__section-task-list-item-complete"
    }
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefasList = somenteCompletas ? tarefasList.filter(tarefasList => !tarefasList.completa) : []
   // tarefasList = tarefasList.filter(tarefa => !tarefa.completa)      //atualiza a lista de tarefas com as q n tao completas
    atualizarTarefas()

}

btRemoverConcluidas.onclick = () => removerTarefas(true)
btRemoverTodas.onclick = () => removerTarefas(false)
