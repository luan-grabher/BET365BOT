/* global selectors, Evento, Promise */

const Apostas = {
    todas: () => {
        return JSON.parse(localStorage.getItem("apostas")) || [];
    },
    salvar: (apostasSalvas) => {
        //Atualiza no local storage as apostas
        localStorage.setItem("apostas", JSON.stringify(apostasSalvas));
    },
    adicionar: (evento) => {
        var saved = Apostas.todas();
        saved.push(evento);
        Apostas.salvar(saved);
    },
    existe: (evento) => {
        var save = Apostas.todas();
        //Procura a aposta
        for (var i = 0; i < save.length; i++) {
            var ap = save[i];
            if (
                    ap.data === evento.data &&
                    ap.times.um.nome === evento.times.um.nome &&
                    ap.times.dois.nome === evento.times.dois.nome) {
                //encontrou a aposta e define como o encontrado
                return true;
            }
        }

        return false;
    },
    adicionarEvento: (evento, chancesDOM)=>{
        return new Promise((success,error)=>{
            
        });
    },
    atualizarEvento: (evento)=>{
        return new Promise((success,error)=>{
            
        });
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
    validarEventos: (competitions) => {
        return new Promise((success, error) => {
            var promises = [];
            
            //Percorre todas competições
            competitions.each((i, competition) => {
                competition = $(competition); //Converte para jquery
                var competicao_nome = competition.find(selectors.competition_name).text();
                var eventos = competition.find(selectors.competition_events);

                //Percorre eventos
                eventos.each((e, evento_DOM) => {
                    evento_DOM = $(evento_DOM); //Jquery
                    var tempo = evento_DOM.find(selectors.evento_tempo);
                    if (tempo.length) {
                        tempo = Number(tempo.text().replaceAll(":", ".")); //Converte tempo para numero

                        var times = evento_DOM.find(selectors.evento_times);
                        var gols = evento_DOM.find(selectors.evento_times_gols);
                        var chancesDOM = evento_DOM.find(selectors.evento_times_chances);

                        var chances = {
                            um: chances.length === 3 ? chances[0] : 0,
                            dois: chances.length === 3 ? chances[2] : 0,
                            empate: chances.length === 3 ? chances[1] : 0
                        };

                        //Cria objeto
                        var evento = Evento.obj(
                                tempo, //tempo
                                competicao_nome,
                                times[0].text(), //Nome time 1
                                times[1].text(), //Nome time 2
                                Number(gols[0].text()), //Gols time 1
                                Number(gols[1].text()), //Gols time 2
                                chances.um, //Chance Time 1
                                chances.dois, //Chance Time 2
                                chances.empate//Chance Empate
                                );

                        //Se  já existir nas apostas feitas
                        if (Apostas.existe(evento)) {
                            //Atualiza a aposta
                            promises.push(Apostas.atualizarEvento(evento));
                        } else if (chances.um > 0 && Evento.validar(evento)) {
                            //Tenta realizar a aposta
                            promises.push(Apostas.adicionarEvento(evento, chancesDOM));
                        }
                    }
                });
            });
            
            Promise.all(promises).then(()=>{
                return success();
            });
        });
    }
};
