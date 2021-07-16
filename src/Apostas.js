/* global selectors, Evento, Promise, Conta, cfg, apostando, Wait */

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
    apostar: (evento, chanceDOM) => {
        return new Promise((success, error) => {
            let clickFinalizar = () => {
                if (document.querySelector(selectors.btnFinalizar) !== null) {
                    document.querySelector(selectors.btnFinalizar).click();
                    apostas.adicionar(evento);
                    removeArrayItem(apostando, evento.times.um.nome + evento.times.dois.nome);
                    console.log(evento);
                } else if (document.querySelector(selectors.btnAceitar) !== null ||
                        document.querySelector(selectors.btnAceitarMudanca) !== null) {
                    clickIfNotNull(selectors.btnAceitar);
                    clickIfNotNull(selectors.btnAceitarMudanca);

                    setTimeout(function () {
                        clickFinalizar()
                    }, 1000);
                }
            }

            var times = evento.times.um.nome + evento.times.dois.nome; //Usado para 'apostando'

            //Se tiver saldo para apostar, aposta não existir e não estiver apostando
            if (Conta.saldo() >= cfg.valorAposta && !Apostas.existe(evento) && !apostando.includes(times)) {
                //Define que está apostando nos times pra nao apostar 2 vezes
                apostando.push(times);

                //Muda o backgournd para vermelho para visualmente poder enchergar
                chanceDOM.css("background-color", "red");

                Wait.elementNonExist(selectors.apostar_div, 20000)
                        .then(() => {
                            //Clica na chance para apostar
                            chanceDOM.click();

                            //Espera a caixa de aposta aparecer até 5 Seg
                            Wait.element(selectors.apostar_div, 5000)
                                    .then((apostar_div) => {
                                        //Espera botão de aposta estar disponivel
                                        Wait.element(selectors.apostar_btn)
                                                .then((apostar_btn) => {
                                                    //Clica no botão de aposta
                                                    apostar_btn.click();
                                                    //Se aparecer outro botão de aposta clica em apostar e espera aparecer o finalizar para clicar no finalizar
                                                    Wait.element()
                                                    //Se aparecer Finalizar, clica em finalizar
                                                    //Se aparecer que não está mais disponível, clica em delete
                                                })
                                                .catch(() => {
                                                    return success();
                                                });
                                    });
                        })
                        .catch(() => {
                            return success();
                        });
            } else {
                return success();
            }

        });
    },
    adicionarEvento: (evento, chancesDOM) => {
        return new Promise((success, error) => {
            //Coloca em quem ta apostando
            if (evento.times.um.chance < evento.times.dois.chance) {
                evento.apostado = evento.times.um.nome;
                Apostas.apostar(evento, chancesDOM[0]).then(() => {
                    //Quando tiver apostado retorna sucesso
                    return success();
                });
            } else {
                evento.apostado = evento.times.dois.nome;
                Apostas.apostar(evento, chancesDOM[2]).then(() => {
                    //Quando tiver apostado retorna sucesso
                    return success();
                });
            }

        });
    },
    atualizarEvento: (evento) => {
        return new Promise((success, error) => {
            //Pega apostas já feitas
            var apostasFeitas = Apostas.todas();

            //Percorre apostas
            apostasFeitas.forEach((ap, i) => {
                if (
                        ap.data === evento.data &&
                        ap.times.um.nome === evento.times.um.nome &&
                        ap.times.dois.nome === evento.times.dois.nome) {

                    //Atualiza placar				
                    ap.ultimoPlacar.tempo = evento.tempo;
                    ap.ultimoPlacar.time1 = evento.times.um.gols;
                    ap.ultimoPlacar.time2 = evento.times.dois.gols;
                    ap.ultimoPlacar.att = getMinutes();

                    //Atualiza o objeto
                    apostasFeitas[i] = ap;

                    Apostas.salvar(apostasFeitas);
                    return success();
                }
            });
        });
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

            Promise.all(promises).then(() => {
                return success();
            });
        });
    }
};