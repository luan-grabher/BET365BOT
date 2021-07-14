/*CFG*/
var apostando = [];

const cfg = {
    valorAposta: 1
};

const filtros = {
    add: [
        {tempoTotal: 8, tempoMaiorQue: 6, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
        {tempoTotal: 10, tempoMaiorQue: 7, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
        {tempoTotal: 12, tempoMaiorQue: 8, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},
        {tempoTotal: 90, tempoMaiorQue: 85, tempoMenorQue: null, empate: 7.9, perdendo: 19, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: null}
    ],
    view: [
        {tempoTotal: null, tempoMaiorQue: null, tempoMenorQue: null, empate: null, perdendo: null, ganhandoMaiorQue: null, difGols: null, temNoNome: null}
    ]
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
    saldo: ".hm-Balance",
    login_Btn: ".hm-MainHeaderRHSLoggedOutWide_LoginContainer",
    login_BtnModal: ".lms-StandardLogin_LoginButton",
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

