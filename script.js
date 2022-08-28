const selecione = e => document.querySelector(e)
const formatarDinheiro = e => e.toLocaleString('en-US', {style: 'currency', currency: 'USD'})

async function dados(){
    const requisicao = await fetch('./data.json')
    const resposta = await requisicao.json()

    return resposta
}

async function iniciar(){
    const Dados = await dados()
    const tamanhos = await tamanhoDasBarras()

    Dados.forEach((item, indice) => {
        const modelo = document.querySelector('.modelos .conteiner-barra-e-dia').cloneNode(true)

        setTimeout(()=> {
            modelo.querySelector('.barra').style.height = `${tamanhos[indice]}%`
        },100)
        modelo.querySelector('.dia').innerHTML = item.day
        modelo.querySelector('.valor').innerHTML = formatarDinheiro(item.amount)

        if(item.day === nomeDoDiaAtual())
            modelo.querySelector('.barra').classList.add('dia--atual')

        modelo.querySelector('.barra').addEventListener('mouseover', () => {
            modelo.querySelector('.valor').style.opacity = 1
        })

        modelo.querySelector('.barra').addEventListener('mouseout', ()=>{
            modelo.querySelector('.valor').style.opacity = 0
        })

        selecione('.area .grafico').append(modelo)
    })

    selecione('.conteiner--balancete span').innerHTML = formatarDinheiro(await projecaoAnual())
    selecione('.valor--faturamento').innerHTML = formatarDinheiro(await projecaoMensal())
}

iniciar()

async function faturamentoDiario(){
    const Dados = await dados()
    const faturamento = []

    Dados.map(item => {
        faturamento.push(item.amount)
    })

    return faturamento
}

async function tamanhoDasBarras(){
    const valoresFaturadosTodosOsDiasDaSemana = await faturamentoDiario()
    const valorMaximo = Math.max(...valoresFaturadosTodosOsDiasDaSemana)
    const alturaEmPercentual = []

    valoresFaturadosTodosOsDiasDaSemana.map(valor => {
        alturaEmPercentual.push((valor * 100) / valorMaximo)
    })

    return alturaEmPercentual
}

function nomeDoDiaAtual(){
    const data = new Date()
    let diaAtual = data.getDay()

    switch(diaAtual){
        case 1:
            diaAtual = 'mon'
            break
        case 2:
            diaAtual = 'tue'
            break
        case 3:
            diaAtual = 'wed'
            break
        case 4:
            diaAtual = 'thu'
            break
        case 5:
            diaAtual = 'fri'
            break
        case 6:
            diaAtual = 'sat'
            break
        case 0:
            diaAtual = 'sun'
            break
    }

    return diaAtual
}

async function faturamentoSemanal(){
    const valoresFaturadosTodosOsDiasDaSemana = await faturamentoDiario()
    let faturamentoSemanal = 0

    valoresFaturadosTodosOsDiasDaSemana.map(valor => {
        faturamentoSemanal += valor
    })

    return faturamentoSemanal
}

async function projecaoMensal(){
    const data = new Date()
    const dataAtual = new Date(data.getFullYear(), data.getMonth(), 0)
    const qtDias = dataAtual.getDate()
    const qtSemanas = qtDias / 7

    return await faturamentoSemanal() * qtSemanas
}

async function projecaoAnual(){
    const qtSemanasNoAno = (365 / 7)

    return await faturamentoSemanal() * qtSemanasNoAno
}