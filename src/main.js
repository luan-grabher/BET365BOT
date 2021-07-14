/* global Wait, Config, Conta, Evento, JSHelper, selectors */

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
    },
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

const btnAposta = {
    clickFinalizar: function (apostaObj) {
        if (document.querySelector(selectors.btnFinalizar) !== null) {
            document.querySelector(selectors.btnFinalizar).click();
            apostas.adicionar(apostaObj);
            removeArrayItem(apostando, apostaObj.times.um.nome + apostaObj.times.dois.nome);
            console.log(apostaObj);
        } else if (document.querySelector(selectors.btnAceitar) !== null ||
                document.querySelector(selectors.btnAceitarMudanca) !== null) {
            clickIfNotNull(selectors.btnAceitar);
            clickIfNotNull(selectors.btnAceitarMudanca);

            setTimeout(function () {
                btnAposta.clickFinalizar(apostaObj)
            }, 1000);
        }
        //Se não tiver finalizar nem apostar, clica em deletar
        //else if(document.querySelector(selectors.btnDeletar) != null){
        //	document.querySelector(selectors.btnDeletar).click();
        //}
    },
    apostar: function (chanceInput, apostaObj) {
        var timesApostados = apostaObj.times.um.nome + apostaObj.times.dois.nome;

        //Se tiver saldo para apostar, aposta não existir e não estiver apostando
        if (conta.getSaldo() >= cfg.valorAposta && !apostas.exist(apostaObj) && !apostando.includes(timesApostados)) {
            //Define que está apostando nos times pra nao apostar 2 vezes
            apostando.push(timesApostados);

            chanceInput.style.background = "red";

            //Fica esperando até que não esteja apostando
            let a = setInterval(function () {
                //Se não estiver apostando em nenhum time
                if (document.querySelector(selectors.caixaAposta) === null) {

                    //Para de esperar para apostar
                    clearInterval(a);

                    //Clica na chance para apostar
                    chanceInput.click();

                    //Espera a caixa de aposta aparecer
                    waitForElementToDisplay(
                            selectors.caixaAposta,
                            function () {
                                waitForElementsToDisplay(
                                        [selectors.btnAceitar, selectors.btnAceitarMudanca],
                                        function () {
                                            btnAposta.clickFinalizar(apostaObj)
                                        }
                                ,
                                        1000,
                                        5000
                                        )
                            },
                            1000,
                            10000
                            );
                }
            }, 500);
        } else {
            return false;
        }
    }
}

const apostas = {
    getAll: function () {
        return JSON.parse(localStorage.getItem("apostas")) || [];
    },
    salvar: function (saved) {
        //Atualiza no local storage as apostas
        localStorage.setItem("apostas", JSON.stringify(saved));
    },
    adicionar: function (aposta) {
        var saved = apostas.getAll();
        saved.push(aposta);
        apostas.salvar(saved);
    },
    exist: function (aposta) {
        var find = false;

        var save = apostas.getAll();

        //Procura a aposta
        for (var i = 0; i < save.length; i++) {
            var ap = save[i];
            if (
                    ap.data === aposta.data &&
                    ap.times.um.nome === aposta.times.um.nome &&
                    ap.times.dois.nome === aposta.times.dois.nome) {
                //encontrou a aposta e define como o encontrado
                find = true;
            }
        }

        return find
    },
    adicionarOuAtualizar: function (aposta, chancesInputs) {
        if (aposta !== null && aposta !== undefined) {
            //Pega apostas já feitas
            var save = apostas.getAll();
            var exists = false;

            //Percorre apostas já feitas para atualizar caso já exista
            for (var i = 0; i < save.length; i++) {
                var ap = save[i];

                if (
                        ap.data === aposta.data &&
                        ap.times.um.nome === aposta.times.um.nome &&
                        ap.times.dois.nome === aposta.times.dois.nome) {

                    // é a mesma aposta, então só atualiza					
                    ap.ultimoPlacar.tempo = aposta.tempo;
                    ap.ultimoPlacar.time1 = aposta.times.um.gols;
                    ap.ultimoPlacar.time2 = aposta.times.dois.gols;
                    ap.ultimoPlacar.att = getMinutes();
                    save[i] = ap;

                    exists = true;
                    apostas.salvar(save);
                    return false;
                }
            }

            //Se não existir e não estiver apostando
            if (!exists && !apostando.includes(aposta.times.um.nome + aposta.times.dois.nome)) {

                //Coloca em quem ta apostando
                if (aposta.times.um.chance < aposta.times.dois.chance) {
                    aposta.apostado = aposta.times.um.nome;
                    return btnAposta.apostar(chancesInputs[0], aposta);
                } else {
                    aposta.apostado = aposta.times.dois.nome;
                    return btnAposta.apostar(chancesInputs[2], aposta);
                }
            }
        }
    }
};

function apostar() {
    //Verifica competições
    var competicoes = document.querySelectorAll(selectors.competitions);

    //Percorre todas competições
    for (var c = 0; c < competicoes.length; c++) {
        //Pega competição
        let competition = competicoes[c];

        //Pega nome
        let competition_name = competition.querySelector(selectors.competition_name).innerText;

        //Pega elementos DOM dos eventos
        var competition_events = document.querySelectorAll(selectors.competition_events);

        //Percorre todos DOM
        for (var i = 0; i < competition_events.length; i++) {
            //Grava em váriavel temporaria o DOM
            var competition_event = competition_events[i];

            var tempo = competition_event.querySelector(selectors.tempo);
            if (tempo !== null) {
                tempo = tempo.innerText.split(":")[0];
                var times = competition_event.querySelectorAll(selectors.times);
                var gols = competition_event.querySelectorAll(selectors.gols);

                //Pega as chances
                var chances = competition_event.querySelectorAll(selectors.chances);
                //Se não concontrar 3 chances, faz uma lista pra abaixo quando setar não der B.O.
                if (chances.length !== 3) {
                    chances = {
                        time1: 0,
                        time2: 0,
                        empate: 0
                    };
                } else {
                    chances = {
                        time1: Number(chances[0].innerText),
                        time2: Number(chances[2].innerText),
                        empate: Number(chances[1].innerText)
                    };
                }

                //Cria objeto
                var evento = EVENT(
                        tempo, //tempo
                        competition_name,
                        times[0].innerText, //Nome time 1
                        times[1].innerText, //Nome time 2
                        Number(gols[0].innerText), //Gols time 1
                        Number(gols[1].innerText), //Gols time 2
                        chances.time1, //Chance Time 1
                        chances.time2, //Chance Time 2
                        chances.empate//Chance Empate
                        );

                if (
                        apostas.exist(evento) || //Se o evento já existir OU
                        (chances.time1 !== 0 && //Existir as 3 chances
                                validarEvento(evento, filtrosAdd)
                                )
                        ) {
                    apostas.adicionarOuAtualizar(evento, competition_event.querySelectorAll(selectors.chances));
                }
            }
        }
    }
}
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

    /*Pega as apostas*/
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
}

const Main = new Promise((success, error) => {
    //Define que está esperando a função terminar
    Wait.waiting["main"] =  true;
    
    //Login
    Conta.login()
            .then(() => {
                //NÃO FAZ NADA POIS A PAGE VAI RECARREGAR
            })
            .catch(() => {
                //CODIGO DA CONTINUAÇÃO AQUI
                //apostar();
                //resultados();
            });
});

/* *************
 * INICIO DE TUDO
 * **************/

console.log("Script Iniciado!");

Wait.element(selectors.competitions, 10000)
        //Quando encontrar as competições
        .then((competitions) => {
            //A cada 2 segundos executa tudo
            setInterval(function () {
                //console.clear();
                if (!Wait.waiting["main"]) {
                    Main()
                            //Terminou a função
                            .then(() => {
                                //Para de esperar a função main
                                Wait.waiting["main"] =  false;
                            });
                }
            }, 2000)
        });