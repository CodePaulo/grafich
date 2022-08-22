//reduzindo algumas escritas que irei usar mais para frente
const queryOne = e => document.querySelector(e)
const queryAll = e => document.querySelectorAll(e)
//formantando o valor recebido pelo data.json para moeda
const moneyFormat = e => e.toLocaleString('en-US', {style: 'currency', currency: 'USD'})

//criando uma função async para importar os dados do data.json
async function inputValue(){
    //requisitando os dados
    const request = await fetch('./data.json')
    //traduzindo a resposta para o javascript ler os dados
    const response = await request.json()

    //crianda uma nova estenção para receber a data atual
    const date = new Date()
    //criando a data atual para pegar a quantidade de dias do mês atual
    const actualDate = new Date(date.getFullYear(), date.getMonth(), 0)
    //pegando a quantidade de dias do mês atual para fazer o calculo do faturamento mensal
    const qtdaysMonth = actualDate.getDate()

    //pegando o dia atual a partir da const date. Deixei minha actualDay como let porquê irei alterar esse valor
    let actualDay = date.getDay()
    //iniciadndo o faturamento mensal em 0
    let balanceMonth = 0

    //mapeando os dados requisitados no data.json
    response.map((item, indice)=>{
        //criando um clone da minha div de modelo para as barras do gráfico
        const modelsGraphic = queryOne('.conteiner--barra').cloneNode(true)
        //calculando o valor total faturado na semana
        balanceMonth += item.amount

        //filtrando somente os dias
        let days = []
        //filtrando somente os valores faturados
        let values = []
        
        //filtrando os dados recebidos
        response.map(item => {
            values.push(item.amount)
            days.push(item.day)
        })

        //transformando o dia atual (que vem no formato de number) para uma string correspondente a ele.
        switch(actualDay){
            case 1:
                actualDay = 'mon'
                break
            case 2:
                actualDay = 'tue'
                break
            case 3:
                actualDay = 'wed'
                break
            case 4:
                actualDay = 'thu'
                break
            case 5:
                actualDay = 'fri'
                break
            case 6:
                actualDay = 'sat'
                break
            case 0:
                actualDay = 'sun'
                break
        }

        //verificando qual é o dia atual para destacalo com uma cor diferente
        if(item.day == actualDay){
            modelsGraphic.querySelector('.barra div').classList.add('dia--atual')
        }

        //calculando qual o tamanho de cada barra do gráfico
        let graphicLength = `${(item.amount * 100) / Math.max(...values)}%`

        //inserindo os valores e os dias dinamicamente no gráfico
        modelsGraphic.querySelector('.valor').innerHTML = moneyFormat(item.amount)
        modelsGraphic.querySelector('.dia').innerHTML = item.day

        //criando o efeito de crescimento das barras do gráfico
        setTimeout(()=>{
            modelsGraphic.querySelector('.barra div').style.height = graphicLength
        },0)

        //add o efeito de passar o mouse na barra e aparecer o valor correspondente a ela
        modelsGraphic.querySelector('.barra div').addEventListener('mouseover',()=>{
            modelsGraphic.querySelector('.valor').style.opacity = '1'
        })

        modelsGraphic.querySelector('.barra div').addEventListener('mouseout',()=>{
            modelsGraphic.querySelector('.valor').style.opacity = '0'
        })

        //por fim, inputando as barras com os valores dentro do gráfico
        queryOne('.grafico').append(modelsGraphic)
    })

    //projetando o balancete do ano com base no faturamento da semana
    let balanceTotal = balanceMonth * (365 / 7)
    //projetando o faturamento mensal com base no faturamento da semana
    balanceMonth = balanceMonth * (qtdaysMonth / 7)

    //criando o efeito de contagem do balancente e do faturamento do mês
    queryOne('.valor--faturamento').innerHTML = moneyFormat(balanceMonth)
    queryOne('.conteiner--balancete span').innerHTML = moneyFormat(balanceTotal)
}

inputValue()
