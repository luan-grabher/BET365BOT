/* global Wait, selectors, filtros, Apostas, Evento, cfg */

const Info = {
    /*Mostra os filtros que estão sendo utilizados para apostar*/
    mostrarFiltrosUtilizados: () => {
        return new Promise((success, error) => {
            //Pega header
            Wait.element(selectors.jogosInstantaneos)
                    .then((jogosInstantaneos) => {

                        //{tempoTotal: 8, tempoMaiorQue: 6, tempoMenorQue: null, empate: 19, perdendo: 9, ganhandoMaiorQue: 1.01, difGols: 2, temNoNome: "Esports"},

                        //Cria uma div com as informações
                        let div = $(jogosInstantaneos).addClass("text-center h6").css("font-size", "x-small");
                        //div.append($("<p></p>").text("Filtros utilizados:").addClass("fw-bold"));

                        let tabela = $("<table></table>").addClass("table-dark bg-dark");
                        //tabela header
                        let th = $("<tr></tr>");
                        th.append($("<td></td>").text("Tempo total").addClass("border px-1"));
                        th.append($("<td></td>").text("Tempo maior que").addClass("border px-1"));
                        th.append($("<td></td>").text("Tempo menor que").addClass("border px-1"));
                        th.append($("<td></td>").text("Empate maior que").addClass("border px-1"));
                        th.append($("<td></td>").text("Perdendo maior que").addClass("border px-1"));
                        th.append($("<td></td>").text("Ganhando maior que").addClass("border px-1"));
                        th.append($("<td></td>").text("Diferença de gols").addClass("border px-1"));
                        th.append($("<td></td>").text("Nome").addClass("border px-1"));
                        tabela.append(th);
                        filtros.add.forEach((filtro) => {
                            let tr = $("<tr></tr>");
                            tr.append($("<td></td>").text(filtro.tempoTotal).addClass("border"));
                            tr.append($("<td></td>").text(filtro.tempoMaiorQue).addClass("border"));
                            tr.append($("<td></td>").text(filtro.tempoMenorQue).addClass("border"));
                            tr.append($("<td></td>").text(filtro.empate).addClass("border"));
                            tr.append($("<td></td>").text(filtro.perdendo).addClass("border"));
                            tr.append($("<td></td>").text(filtro.ganhandoMaiorQue).addClass("border"));
                            tr.append($("<td></td>").text(filtro.difGols).addClass("border"));
                            tr.append($("<td></td>").text(filtro.temNoNome).addClass("border"));
                            tabela.append(tr);
                        });
                        div.html(tabela);
                        return success();
                    });
        });
    },
    mostrarResultados: () => {
        return new Promise((success, error) => {
            //Pega apostas
            let apostasFeitas = Apostas.todas();

            let totais = {
                vitorias: 0,
                derrotas: 0,
                ganhos: 0.00,
                perdas: 0.00,
                lucro: 0.00
            };

            let tabela = $("<table></table>").addClass("table-primary bg-primary").css("font-size", "x-small");

            let th = $("<tr></tr>");
            th.append($("<th></th>").text("Data").addClass("border"));
            th.append($("<th></th>").text("Status").addClass("border"));
            th.append($("<th></th>").text("Tempo T").addClass("border"));
            th.append($("<th></th>").text("Tempo").addClass("border"));
            th.append($("<th></th>").text("Time Apostado").addClass("border"));
            th.append($("<th></th>").text("Time Contra").addClass("border"));
            th.append($("<th></th>").text("Chance").addClass("border"));
            th.append($("<th></th>").text("Empate").addClass("border"));
            th.append($("<th></th>").text("Chance Virada").addClass("border"));
            th.append($("<th></th>").text("Gols Inicio").addClass("border"));
            th.append($("<th></th>").text("Gols Diff").addClass("border"));
            th.append($("<th></th>").text("Gols Final").addClass("border"));

            tabela.append(th);

            apostasFeitas.forEach((aposta) => {
                //Se o dia não for igual a hoje ou o dia igual a hoje mas a ultima atualização já faz mais de 2 minutos
                if (aposta.data !== getDate() || (aposta.data === getDate() && (getMinutes() - aposta.ultimoPlacar.att) > 2)) {

                    //Se for um filtro válido para as estatisticas
                    Evento.validar(aposta, filtros.view)
                            .then(() => {
                                //Predefine as informações da aposta
                                let
                                        timeApostado = aposta.times.um,
                                        timeVs = aposta.times.dois,
                                        chanceEmpate = aposta.times.empate.chance,
                                        golsFinalApostado = aposta.ultimoPlacar.time1,
                                        golsFinalVS = aposta.ultimoPlacar.time2,
                                        status = "VITORIA";

                                //Caso o time apostado for o 2, ai altera
                                if (aposta.apostado === aposta.times.dois.nome) {
                                    timeApostado = aposta.times.dois;
                                    timeVs = aposta.times.um;
                                    golsFinalApostado = aposta.ultimoPlacar.time2;
                                    golsFinalVS = aposta.ultimoPlacar.time1;
                                }

                                //Se for vitoria (gols apostado + gols adversario)
                                if (golsFinalApostado > golsFinalVS) {
                                    totais.vitorias++;
                                    totais.ganhos += round((cfg.valorAposta * timeApostado.chance) - cfg.valorAposta);
                                } else {
                                    totais.derrotas++;
                                    totais.perdas += round(cfg.valorAposta);

                                    status = "DERROTA";
                                }

                                let tr = $("<tr></tr>");
                                tr.append($("<tr></tr>").text(aposta.data).addClass("border"));
                                tr.append($("<tr></tr>").text(status).addClass("border"));
                                tr.append($("<tr></tr>").text(aposta.tempoTotal).addClass("border"));
                                tr.append($("<tr></tr>").text(aposta.tempo).addClass("border"));
                                tr.append($("<tr></tr>").text(timeApostado.nome).addClass("border"));
                                tr.append($("<tr></tr>").text(timeVs.nome).addClass("border"));
                                tr.append($("<tr></tr>").text(timeApostado.chance).addClass("border"));
                                tr.append($("<tr></tr>").text(chanceEmpate).addClass("border"));
                                tr.append($("<tr></tr>").text(timeVs.chance).addClass("border"));
                                tr.append($("<tr></tr>").text(timeApostado.gols + " X " + timeVs.gols).addClass("border"));
                                tr.append($("<tr></tr>").text(timeApostado.gols - timeVs.gols).addClass("border"));
                                tr.append($("<tr></tr>").text(golsFinalApostado + " X " + golsFinalVS).addClass("border"));

                                tabela.append(tr);
                            })
                            .catch(() => {
                                //nada
                            });
                }
            });

            //Coloca o lucro
            totais.lucro = round(totais.ganhos - totais.perdas);

            //informações
            let infos = $("<div></div>").css("font-size","x-small");
            
            infos.append($("<p></p>").append($("<b></b>").text("Ultima atualização: ")).text(getDate() + " " + getHours()));
            infos.append($("<p></p>").append($("<b></b>").text("Vitórias: ")).text(totais.vitorias));
            infos.append($("<p></p>").append($("<b></b>").text("Derrotas: ")).text(totais.derrotas));
            infos.append($("<p></p>").append($("<b></b>").text("Ganhos: ")).text(totais.ganhos));
            infos.append($("<p></p>").append($("<b></b>").text("Perdas: ")).text(totais.perdas));
            infos.append($("<p></p>").append($("<b></b>").text("Liquido: ")).text(totais.lucro));            

            //Pega a div de informações de atrasos de transmissões que vai colocar as estatisticas
            let div = $(selectors.infoAtrasos);
            div.removeClass("fm-InPlayNotice_WidthState2"); //remove essa clasee que eu nao sei pra que serve
            
            div.append(infos);
            div.append(tabela);
            
            return success();
        });
    }
};