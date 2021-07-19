const Evento = {
    validar: (evento, filtros) => {
        return new Promise((success, fail) => {
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

                difGols = evento.times.dois.gols - evento.times.um.gols;
            } else {
                ganhando = evento.times.um.chance;
                perdendo = evento.times.dois.chance;

                difGols = evento.times.um.gols - evento.times.dois.gols;
            }

            for (var f = 0; f < filtros.length; f++) {
                let filtro = filtros[f];

                

                //empate, perdendo, ganhandoMaiorQue, difGols
                if (
                        (filtro.tempoTotal === null || filtro.tempoTotal === evento.tempoTotal) &&
                        (filtro.tempoMaiorQue === null || tempo > filtro.tempoMaiorQue) &&
                        (filtro.tempoMenorQue === null || tempo < filtro.tempoMenorQue) &&
                        (filtro.empate === null || empate > filtro.empate) &&
                        (filtro.perdendo === null || perdendo > filtro.perdendo) &&
                        (filtro.ganhandoMaiorQue === null || ganhando > filtro.ganhandoMaiorQue) &&
                        (filtro.difGols === null || difGols >= filtro.difGols) &&
                        (filtro.temNoNome === null || (evento.times.um.nome.includes(filtro.temNoNome) && evento.times.dois.nome.includes(filtro.temNoNome)))
                        ) {
                    debug(filtro, true);
                    
                    return success();
                }
            }

            return fail();
        });
    },
    obj: (tempo, competition, time1Nome, time2Nome, time1Gols, time2Gols, time1Chance, time2Chance, empateChance) => {
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
                dois: {nome: time2Nome, gols: time2Gols, chance: time2Chance},
                empate: {nome: "Empate", gols: 0, chance: empateChance}
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
};