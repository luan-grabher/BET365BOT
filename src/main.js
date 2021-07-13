/*CFG*/
var apostando = [];

const cfg = {
    valorAposta: 1
};



function addOnHead(html) {
    let head = document.querySelector("head");
    head.appendChild(html);
}


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
;

function removeArrayItem(array, item) {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}

const FILTER = function (tempoTotal, tempoMaiorQue, tempoMenorQue, empate, perdendo, ganhandoMaiorQue, difGols, temNoNome) {
    return{
        tempoTotal: tempoTotal,
        tempoMaiorQue: tempoMaiorQue,
        tempoMenorQue: tempoMenorQue,
        empate: empate,
        perdendo: perdendo,
        ganhandoMaiorQue: ganhandoMaiorQue,
        difGols: difGols,
        temNoNome: temNoNome
    }
}
// { tempoTotal: tempoTotal, tempoMaiorQue: tempoMaiorQue, tempoMenorQue: tempoMenorQue, empate: empate, perdendo: perdendo, ganhandoMaiorQue: ganhandoMaiorQue, difGols: difGols, temNoNome: temNoNome }
//

const filtrosAdd = [
    {tempoTotal: 8, tempoMaiorQue: 6, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
    {tempoTotal: 10, tempoMaiorQue: 7, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
    {tempoTotal: 12, tempoMaiorQue: 8, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
    {tempoTotal: 90, tempoMaiorQue: 85, tempoMenorQue: null, empate: 7.9, perdendo: 19, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: null}
];

const filtrosView = [
    {tempoTotal: null, tempoMaiorQue: null, tempoMenorQue: null, empate: null, perdendo: null, ganhandoMaiorQue: null, difGols: null, temNoNome: null}
];



function clickIfNotNull(selector) {
    let e = document.querySelector(selector);
    if (e != null) {
        e.click();
        return true;
    } else {
        return false;
    }
}


function round(num) {
    return Math.round(num * 100) / 100
}

function getDate() {
    var dt = new Date();
    return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

function getHours() {
    var dt = new Date();
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
}

function getMinutes() {
    var dt = new Date();
    return (dt.getHours() * 60) + dt.getMinutes();
}

const conta = {
    getSaldo: function () {
        let divSaldo = document.querySelector(".hm-Balance");
        let saldo = divSaldo == null ? "R$0,00" : divSaldo.innerText;

        saldo = saldo.replaceAll(/[^0-9,]*/gm, "").replaceAll(",", ".");

        return Number(saldo);
    },
    login: function () {
        let btnLogin = document.querySelector(selectors.loginBtn);
        //Se tiver o botão de login
        if (btnLogin != null) {
            //clica no botao de login do header
            btnLogin.click();
            setTimeout(function () {
                //clica no login do modal
                clickIfNotNull(selectors.loginBtnModal);
            }, 1000);
        }
    }
};

const selectors = {
    competitions: ".ovm-Competition.ovm-Competition-open",
    competition_name: ".ovm-CompetitionHeader_Name",
    competition_events: ".ovm-Fixture.ovm-Fixture-horizontal.ovm-Fixture-media",
    times: ".ovm-FixtureDetailsTwoWay_TeamName",
    tempo: ".ovm-InPlayTimer",
    gols: ".ovm-StandardScores_ScoresWrapper div",
    chances: ".ovm-ParticipantOddsOnly_Odds",
    mainLiveList: ".ovm-OverviewView_Classification",
    stakeBox: ".qbs-StakeBox_Wrapper",
    loginBtn: ".hm-MainHeaderRHSLoggedOutWide_LoginContainer",
    loginBtnModal: ".lms-StandardLogin_LoginButton",
    verificacaoDeConta: "#remindLater",
    notificacaoIframe: ".lp-UserNotificationsPopup_Frame",
    caixaAposta: ".qbs-StakeBox",
    btnFinalizar: ".qbs-QuickBetHeader_DoneButton",
    btnDeletar: ".bs-DeleteButton",
    btnAceitar: ".qbs-PlaceBetButton_Wrapper",
    btnAceitarMudanca: ".qbs-AcceptButton",
    btnAceitarMudancaOutro: ".qbs-AcceptButton_PlaceBet",
    btnEncerrarApostas: ".myb-MyBetsHeader_Container > div:nth-child(1)",
    valoresApostasAtuais: ".myb-OpenBetItemInnerView_BetInformationContainer",
    lucroEsperado: ".myb-OpenBetItemInnerView_BetInformationText",
    lucroParaFinalizar: ".myb-CloseBetButtonBase_Return"
}

const TEAM = function (nome, gols, chance) {
    return {
        nome: nome,
        gols: gols,
        chance: chance
    }
}

const EVENT = function (tempo, competition, time1Nome, time2Nome, time1Gols, time2Gols, time1Chance, time2Chance, empateChance) {
    let tempoMax = 90;

    if (competition.includes("12 m")) {
        tempoMax = 12;
    } else if (competition.includes("10 m")) {
        tempoMax = 10;
    } else if (competition.includes("8 m")) {
        tempoMax = 8;
    }

    return {
        tempo: tempo,
        apostado: "",
        competition: competition,
        tempoTotal: tempoMax,
        times: {
            um: {nome: time1Nome, gols: time1Gols, chance: time1Chance},
            dois: TEAM(time2Nome, time2Gols, time2Chance),
            empate: TEAM("Empate", 0, empateChance)
        },
        ultimoPlacar: {
            tempo: tempo,
            time1: time1Gols,
            time2: time2Gols,
            att: getMinutes()
        },
        data: getDate()
    }
}

const btnAposta = {
    clickFinalizar: function (apostaObj) {
        if (document.querySelector(selectors.btnFinalizar) != null) {
            document.querySelector(selectors.btnFinalizar).click();
            apostas.adicionar(apostaObj);
            removeArrayItem(apostando, apostaObj.times.um.nome + apostaObj.times.dois.nome);
            console.log(apostaObj);
        } else if (document.querySelector(selectors.btnAceitar) != null ||
                document.querySelector(selectors.btnAceitarMudanca) != null) {
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
                if (document.querySelector(selectors.caixaAposta) == null) {

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
                    ap.data == aposta.data &&
                    ap.times.um.nome == aposta.times.um.nome &&
                    ap.times.dois.nome == aposta.times.dois.nome) {
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
                        ap.data == aposta.data &&
                        ap.times.um.nome == aposta.times.um.nome &&
                        ap.times.dois.nome == aposta.times.dois.nome) {

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

function validarEvento(evento, filtros) {

    //Configura chances
    let
            ganhando = 0,
            empate = evento.times.empate.chance,
            perdendo = 0,
            difGols = 0,
            tempo = evento.tempo;

    if (evento.times.um.chance > evento.times.dois.chance) {
        ganhando = evento.times.dois.chance;
        perdendo = evento.times.um.chance;

        difGols = evento.times.dois.gols - evento.times.um.gols
    } else {
        ganhando = evento.times.um.chance;
        perdendo = evento.times.dois.chance;

        difGols = evento.times.um.gols - evento.times.dois.gols
    }


    for (var f = 0; f < filtros.length; f++) {
        let filtro = filtros[f];

        //empate, perdendo, ganhandoMaiorQue, difGols
        if (
                (filtro.tempoTotal == null || filtro.tempoTotal == evento.tempoTotal) &&
                (filtro.tempoMaiorQue == null || tempo > filtro.tempoMaiorQue) &&
                (filtro.tempoMenorQue == null || tempo < filtro.tempoMenorQue) &&
                (filtro.empate == null || empate > filtro.empate) &&
                (filtro.perdendo == null || perdendo > filtro.perdendo) &&
                (filtro.ganhandoMaiorQue == null || ganhando > filtro.ganhandoMaiorQue) &&
                (filtro.difGols == null || difGols >= filtro.difGols) &&
                (filtro.temNoNome == null || (evento.times.um.nome.includes(filtro.temNoNome) && evento.times.dois.nome.includes(filtro.temNoNome)))
                ) {
            return true;
        }
    }

    return false;
}

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
        if (evento.data !== hoje || (evento.data == hoje && (getMinutes() - evento.ultimoPlacar.att) > 2)) {
            //Retrições de analizes
            if (validarEvento(evento, filtrosView)) {
                let timeApostado = evento.times.um,
                        timeVs = evento.times.dois,
                        chanceEmpate = evento.times.empate.chance,
                        golsFinalApostado = evento.ultimoPlacar.time1,
                        golsFinalVS = evento.ultimoPlacar.time2,
                        status = "VITORIA";

                if (evento.apostado == evento.times.dois.nome) {
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

console.log("Script Iniciado!");

//Espera o site mostrar as competições, se tiver as competições inicia script de aposta
waitForElementToDisplay(
        selectors.competitions,
        function () {
            //Insere no head
            addOnHead(tableStyle());

            //Repete infinitamente a cada 2 segundos
            setInterval(function () {
                //console.clear();

                conta.login()
                apostar();
                resultados();

                //Mostra times que está apostando para mostrar que ta funcionando
                console.log(apostando);
            }, 2000)
        },
        1000,
        15000
        );