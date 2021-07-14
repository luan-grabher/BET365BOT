/* global Wait, Config, Conta, Evento, JSHelper, selectors, apostando, conta, cfg, Apostas */

function tableStyle() {
    var style = document.createElement('style');
    style.type = 'text/css';

    let text = ".tabela { \n" +
            "  font-family: Arial, Helvetica, sans-serif; " +
            "  border-collapse: collapse; " +
            "  width: 100%; " +
            "  text-align: center;" +
            "  font-size: 80%" +
            "} " +
            " " +
            ".tabela td, .tabela th { " +
            "  border: 1px solid #ddd; " +
            "  padding: 2px; " +
            "} " +
            ".tabela tr:nth-child(even){background-color: #f2f2f2;} " +
            ".tabela tr:hover {background-color: #ddd;} ";
    style.innerHTML = text;
    return style;
}

const table = {
    tb: function (text) {
        return "<table class='tabela'>" + text + "</table>";
    },
    tr: function (text) {
        return "<tr>" + text + "</tr>";
    },
    td: function (text) {
        return "<td>" + text + "</td>";
    }
};


function tabelarEvento(data, status, tempoTotal, tempo, timeApostado, timeVs, chanceEmpate, golsFinalApostado, golsFinalVS) {
    var tds = table.td(data.replaceAll("2021-", ""));
    tds += table.td(status);
    tds += table.td(tempoTotal);
    tds += table.td(tempo);
    tds += table.td(timeApostado.nome);
    tds += table.td(timeVs.nome);
    tds += table.td(timeApostado.chance);
    tds += table.td(chanceEmpate);
    tds += table.td(timeVs.chance);
    tds += table.td(timeApostado.gols + " X " + timeVs.gols);
    tds += table.td(timeApostado.gols - timeVs.gols);
    tds += table.td(golsFinalApostado + " X " + golsFinalVS);
    return table.tr(tds);
}
;
/*

 
 function resultados() {
 let estatisticas = document.querySelector("estatisticas");
 
 //Verifica se a div de estatisticas já existe
 if (estatisticas == null) {
 
 document
 .querySelector(selectors.mainLiveList) //Pega o main div
 .prepend(
 document.createElement("estatisticas") //coloca um elemento estatisticas no main div
 );
 
 
 //Pega o elemento atualizado
 estatisticas = document.querySelector("estatisticas");
 }
 
 //Cria div para colocar no elemento
 let newHtml = document.createElement("div");
 newHtml.style.color = "black";
 newHtml.style.padding = "5%";
 
 //Pega apostas
 let resultados = apostas.getAll();
 
 let totals = {
 vitorias: 0,
 derrotas: 0,
 ganhos: 0.00,
 perdas: 0.00,
 lucro: 0.00,
 att: getDate() + " " + getHours()
 };
 
 let valorAposta = cfg.valorAposta;
 
 let trs = "";
 let hoje = getDate();
 
 var th = table.td("DATA");
 th += table.td("STATUS");
 th += table.td("TEMPO T");
 th += table.td("TEMPO");
 th += table.td("TIME APOSTADO");
 th += table.td("TIME CONTRA");
 th += table.td("CHANCE");
 th += table.td("EMPATE");
 th += table.td("CHANCE VS");
 th += table.td("GOLS INICIO");
 th += table.td("GOLS DIFF");
 th += table.td("GOLS FIM");
 trs += table.tr(th);
 
 for (var i = 0; i < resultados.length; i++) {
 let evento = resultados[i];
 
 let tempo = evento.ultimoPlacar.tempo
 
 //Se já terminou
 if (evento.data !== hoje || (evento.data === hoje && (getMinutes() - evento.ultimoPlacar.att) > 2)) {
 //Retrições de analizes
 if (validarEvento(evento, filtrosView)) {
 let timeApostado = evento.times.um,
 timeVs = evento.times.dois,
 chanceEmpate = evento.times.empate.chance,
 golsFinalApostado = evento.ultimoPlacar.time1,
 golsFinalVS = evento.ultimoPlacar.time2,
 status = "VITORIA";
 
 if (evento.apostado === evento.times.dois.nome) {
 timeApostado = evento.times.dois;
 timeVs = evento.times.um;
 golsFinalApostado = evento.ultimoPlacar.time2,
 golsFinalVS = evento.ultimoPlacar.time1;
 }
 
 //SE VITORIA
 if (golsFinalApostado > golsFinalVS) {
 totals.vitorias++;
 totals.ganhos += (valorAposta * timeApostado.chance) - valorAposta;
 totals.lucro = round(totals.ganhos - totals.perdas, 2);
 
 totals.ganhos = round(totals.ganhos)
 } else {
 totals.derrotas++;
 totals.perdas += round(valorAposta, 2);
 totals.lucro = round(totals.ganhos - totals.perdas, 2);
 
 status = "DERROTA";
 }
 
 trs += tabelarEvento(evento.data, status, evento.tempoTotal, evento.tempo, timeApostado, timeVs, chanceEmpate, golsFinalApostado, golsFinalVS);
 }
 }
 }
 
 ap = "<pre>" + JSON.stringify(totals, null, "\t") + "</pre>";
 
 let infos = "<div class='resultados-infos'>"
 infos += "<b>ÚLTIMA ATUALIZAÇÃO: </b>" + totals.att + "<br>"
 infos += "<b>ATIVAS AGORA: </b>" + (resultados.length - (totals.vitorias + totals.derrotas)) + "<br>"
 infos += "<b>VITÓRIAS: </b>" + totals.vitorias + "<br>"
 infos += "<b>DERROTAS: </b>" + totals.derrotas + "<br>"
 infos += "<b>GANHOS: </b>R$ " + totals.ganhos + "<br>"
 infos += "<b>PERDAS: </b>R$ " + totals.perdas + "<br>"
 infos += "<b>LÍQUIDO: </b>R$ " + totals.lucro + "<br>"
 infos += "</div><br><br>";
 
 newHtml.innerHTML = infos + table.tb(trs);
 
 estatisticas.innerHTML = "";
 estatisticas.append(newHtml);
 }*/

const Main = function (competitions) {
    return new Promise((success, error) => {
        //Define que está esperando a função terminar
        Wait.waiting["main"] = true;

        //Login
        Conta.login
                .then(() => {
                    //NÃO FAZ NADA POIS A PAGE VAI RECARREGAR
                    console.log("Na teoria é para recarregar a página agora.");
                })
                .catch(() => {
                    //CODIGO DA CONTINUAÇÃO AQUI                
                    Apostas.validarEventos(competitions)
                            .then(() => {
                                success();
                            });
                    //resultados();
                });
    });
}

/* *************
 * INICIO DE TUDO
 * **************/

console.clear();
console.log("Script Iniciado!");

//Espera até 10s pelas competições
Wait.element(selectors.competitions, 10000)
        //Quando encontrar as competições
        .then((competitions) => {
            //A cada 2 segundos executa tudo
            setInterval(function () {
                //console.clear();
                if (!Wait.waiting["main"]) {
                    Main(competitions)
                            //Terminou a função
                            .then(() => {
                                //Para de esperar a função main
                                Wait.waiting["main"] = false;
                            });
                }
            }, 2000)
        });