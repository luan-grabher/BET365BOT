/* global selectors, Evento, Promise, Conta, cfg, apostando, Wait, filtros */

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
            var times = evento.times.um.nome + evento.times.dois.nome; //Usado para 'apostando'

            //Se tiver saldo para apostar, aposta não existir e não estiver apostando
            if (Conta.saldo() >= cfg.valorAposta && !Apostas.existe(evento) && !apostando.includes(times)) {
                //Define que está apostando nos times pra nao apostar 2 vezes
                apostando.push(times);

                //Muda o backgournd para vermelho para visualmente poder enchergar
                chanceDOM.css("background-color", "red");

                debug(
                        "Esperando div aposta desaparecer para o evento: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                        " - T " + evento.tempo +
                        " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                        );
                Wait.elementNonExist(selectors.apostar_div, 20000)
                        .then(() => {
                            //Clica na chance para apostar
                            chanceDOM.click();

                            debug(
                                    "Clicou na chance no evento: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                                    " - T " + evento.tempo +
                                    " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                                    ,true);
                            //Espera a caixa de aposta aparecer até 5 Seg
                            Wait.element(selectors.apostar_div)
                                    .then((apostar_div) => {
                                        let esperarBtnCancelar = () => {
                                            return  Wait.element(selectors.apostar_cancelar)
                                                    .then((apostar_cancelar) => {
                                                        apostar_cancelar.click();
                                                        removeArrayItem(apostando, evento.times.um.nome + evento.times.dois.nome);
                                                        return success();
                                                    })
                                                    .catch(() => {
                                                        //Não apareceu o btn de cancelar, desiste de tudo, não sei o que ta acontecendo
                                                        console.log("Mano, não achei o botao de aposta depois de abrir a caixa de aposta e tbm não achei o botao de cancelar, ve o que houve ai");
                                                        removeArrayItem(apostando, evento.times.um.nome + evento.times.dois.nome);
                                                        return success();
                                                    });
                                        };

                                        let esperarBtnFinalizar = () => {
                                            return Wait.element(selectors.apostar_btnFinalizar, 10000)
                                                    .then((btnFinalizar) => {
                                                        btnFinalizar.click();
                                                        debug(
                                                                "Clicou para finalizar o evento: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                                                                " - T " + evento.tempo +
                                                                " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                                                                );
                                                        Apostas.adicionar(evento);
                                                        removeArrayItem(apostando, evento.times.um.nome + evento.times.dois.nome);
                                                        debug(
                                                                "Adicionou no BD o evento: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                                                                " - T " + evento.tempo +
                                                                " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                                                                );

                                                        return success();
                                                    })
                                                    .catch(() => {
                                                        return esperarBtnCancelar();
                                                    });
                                        };

                                        //Espera botão de aposta estar disponivel
                                        Wait.element(selectors.apostar_btn)
                                                .then((apostar_btn) => {
                                                    //Clica no botão de aposta
                                                    apostar_btn.click();

                                                    debug(
                                                            "Clicou para apostar no evento: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                                                            " - T " + evento.tempo +
                                                            " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                                                            );

                                                    //Se aparecer outro botão de aposta clica em apostar e espera aparecer o finalizar para clicar no finalizar
                                                    Wait.element(selectors.apostar_div, 10000)
                                                            .then((apostar_btn2) => {
                                                                apostar_btn2.click();

                                                                debug(
                                                                        "Clicou para apostar denovo no evento: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                                                                        " - T " + evento.tempo +
                                                                        " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                                                                        );

                                                                //Finaliza
                                                                return esperarBtnFinalizar();
                                                            })
                                                            .catch(() => {
                                                                //Não apareceu o segundo botão, então espera aparecer o finalizar
                                                                return esperarBtnFinalizar();
                                                            });
                                                })
                                                .catch(() => {
                                                    //Não achou o btn de aposta, então cancela
                                                    return esperarBtnCancelar();
                                                });
                                    });
                        })
                        .catch(() => {
                            debug("A caixa de apostas não para de existir");
                            removeArrayItem(apostando, evento.times.um.nome + evento.times.dois.nome);
                            return success();
                        });
            } else {
                debug("Sem saldo ou já existe em apostando");
                return success();
            }

        });
    },
    adicionarEvento: (evento, chancesDOM) => {
        return new Promise((success, error) => {
            //Coloca em quem ta apostando
            if (evento.times.um.chance < evento.times.dois.chance) {
                evento.apostado = evento.times.um.nome;
                Apostas.apostar(evento, $(chancesDOM[0])).then(() => {
                    //Quando tiver apostado retorna sucesso
                    return success();
                });
            } else {
                evento.apostado = evento.times.dois.nome;
                Apostas.apostar(evento, $(chancesDOM[2])).then(() => {
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
                    debug(
                            "Evento atualizado no BD: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                            " - T " + evento.tempo +
                            " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                            );
                    return success();
                }
            });
        });
    },
    validarEventos: (competitions) => {
        return new Promise((success, error) => {
            var promises = [];

            debug("Percorrendo competições...");
            //Percorre todas competições
            competitions.each((i, competition) => {
                competition = $(competition); //Converte para jquery
                var competicao_nome = competition.find(selectors.competition_name).text();
                var eventos = competition.find(selectors.competition_events);
                
                debug("Competição '" + competicao_nome + "'");

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
                            um: chancesDOM.length === 3 ? Number($(chancesDOM[0]).text()) : 0,
                            dois: chancesDOM.length === 3 ? Number($(chancesDOM[2]).text()) : 0,
                            empate: chancesDOM.length === 3 ? Number($(chancesDOM[1]).text()) : 0
                        };

                        //Cria objeto
                        var evento = Evento.obj(
                                tempo, //tempo
                                competicao_nome,
                                $(times[0]).text(), //Nome time 1
                                $(times[1]).text(), //Nome time 2
                                Number($(gols[0]).text()), //Gols time 1
                                Number($(gols[1]).text()), //Gols time 2
                                chances.um, //Chance Time 1
                                chances.dois, //Chance Time 2
                                chances.empate//Chance Empate
                                );

                        debug(
                                "::::Evento analisado: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                                " - T " + tempo +
                                " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                                );

                        //Se  já existir nas apostas feitas
                        if (Apostas.existe(evento)) {
                            //Atualiza a aposta
                            promises.push(Apostas.atualizarEvento(evento));
                        } else if (chances.um > 0) {
                            Evento.validar(evento, filtros.add)
                                    .then(() => {
                                        debug(
                                                "Evento valido: " + evento.times.um.nome + " VS " + evento.times.dois.nome +
                                                " - T " + tempo +
                                                " - G " + evento.times.um.gols + "X" + evento.times.dois.gols
                                                );
                                        //Tenta realizar a aposta
                                        promises.push(Apostas.adicionarEvento(evento, chancesDOM));
                                    })
                                    .catch(() => {
                                        //Não afz nada, o evento é invalido
                                    });
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