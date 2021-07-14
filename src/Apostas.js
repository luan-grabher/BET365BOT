const Apostas = {
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
    },
    validarEventos = (competitions) => {
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
};
