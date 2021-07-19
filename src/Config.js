/*CFG*/
var apostando = [];

const cfg = {
    valorAposta: 1
};

const filtros = {
    add: [
        {tempoTotal: 8, tempoMaiorQue: 6, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
        {tempoTotal: 10, tempoMaiorQue: 6, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 3, temNoNome: "Esports"},
        {tempoTotal: 10, tempoMaiorQue: 7, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
        {tempoTotal: 12, tempoMaiorQue: 8, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
        {tempoTotal: 90, tempoMaiorQue: 85, tempoMenorQue: null, empate: 7.9, perdendo: 19, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: null}
    ],
    view: [
        {tempoTotal: null, tempoMaiorQue: null, tempoMenorQue: null, empate: null, perdendo: null, ganhandoMaiorQue: null, difGols: null, temNoNome: null}
    ]
};

//Para desativar o debug troque o 'mostrar' pata false, entao somente quem passar o mostrar como true vai mostrar
const debug = (msg, mostrar = true) => {
    if (mostrar) {
        console.log(msg);
}
};

const selectors = {
    competitions: ".ovm-Competition.ovm-Competition-open",
    competition_name: ".ovm-CompetitionHeader_Name",
    competition_events: ".ovm-Fixture.ovm-Fixture-horizontal.ovm-Fixture-media",
    evento_tempo: ".ovm-InPlayTimer",
    evento_times: ".ovm-FixtureDetailsTwoWay_TeamName",
    evento_times_gols: ".ovm-StandardScores_ScoresWrapper div",
    evento_times_chances: ".ovm-ParticipantOddsOnly_Odds",
    principal: ".ovm-OverviewView_Classification",
    saldo: ".hm-Balance",
    login_Btn: ".hm-MainHeaderRHSLoggedOutWide_LoginContainer",
    login_BtnModal: ".lms-StandardLogin_LoginButton",
    login_User: ".lms-StandardLogin_Username",
    login_Password: ".lms-StandardLogin_Password",
    verificacaoDeConta: "#remindLater",
    apostar_div: ".qbs-StakeBox",
    apostar_btn: ".qbs-BetPlacement > div",
    apostar_cancelar: ".bs-DeleteButton",
    apostar_btnFinalizar: ".qbs-QuickBetHeader_DoneButton",
    header: ".hm-HeaderModule",
    loading: ".bl-Preloader",
    btnEncerrarApostas: ".myb-MyBetsHeader_Container > div:nth-child(1)",
    valoresApostasAtuais: ".myb-OpenBetItemInnerView_BetInformationContainer",
    lucroEsperado: ".myb-OpenBetItemInnerView_BetInformationText",
    lucroParaFinalizar: ".myb-CloseBetButtonBase_Return"
};

