/* global Wait, Config, Conta, Evento, JSHelper, selectors, apostando, conta, cfg, Apostas, filtros, Info, addBootstrap */

const Main = (competitions) => {
    return new Promise((success, error) => {
        //Define que está esperando a função terminar
        Wait.waiting["main"] = true;
        localStorage.setItem("ultimaAtt", new Date().getTime());

        //Atualiza saldo
        Conta.atualizarSaldo()
                .then(() => {
                    debug("Saldo atualizado.");
                    Info.mostrarResultados();
                    Apostas.validarEventos(competitions)
                            .then(() => {
                                debug("Acabou de validar os eventos.");
                                return success();
                            })
                            .catch(() => {
                                //Se der algum erro na validação de eventos
                                return error();
                            });
                })
                .catch(() => {
                    //Se não consegir atualizar o saldo, recarrega a pagina                                
                    return error();
                });
    });
};

/* *************
 * INICIO DE TUDO
 * **************/

console.clear();
console.log("Script Iniciado!");

//A cada 2 minutos verifica se o codigo está rodando
setInterval(()=>{
    let agora = new Date().getTime();
    
    let ultimaAtt = localStorage.getItem("ultimaAtt") || 0;
    ultimaAtt = Number(ultimaAtt);
    
    //Se fizer mais de 2 minutos desde a ultima att
    if(agora-ultimaAtt > 120000){
        //recarrega a pagina
        document.location.reload(true);
    }
},120000);

//Espera até 10s pelas competições
Wait.element(selectors.competitions, 5000)
        //Quando encontrar as competições
        .then((competitionsToStart) => {
            //Remove o loader
            Wait.element(selectors.loading)
                    .then((loading) => {
                        loading.remove();
                    })
                    .catch(() => {
                        //nao faz nada
                    });

            //Mostra os filtros utilizados
            addBootstrap().then(() => {
                Info.mostrarFiltrosUtilizados();
            });


            //Tenta fazer o login
            Conta.login()
                    .then(() => {
                        //NÃO FAZ NADA POIS A PAGE VAI RECARREGAR
                        console.log("Na teoria é para recarregar a página agora.");
                    })
                    .catch(() => {
                        //A cada 2 segundos executa tudo
                        setInterval(function () {
                            console.clear();
                            console.log("Rodando programa...");
                            if (!Wait.waiting["main"]) {
                                console.log("Verificando competições...");
                                //Pega competições
                                Wait.element(selectors.competitions, 2000)
                                        .then((competitions) => {
                                            Main(competitions)
                                                    //Terminou a função
                                                    .then(() => {
                                                        debug("Acabou de executar a função principal.");
                                                        //Para de esperar a função main
                                                        Wait.waiting["main"] = false;
                                                    })
                                                    .catch(() => {
                                                        Wait.waiting["main"] = false;
                                                        //Se der algum erro na função principal recarrega a pagina
                                                        document.location.reload(true);
                                                    });
                                        })
                                        .catch(() => {
                                            Wait.waiting["main"] = false;
                                            //Se não achar as competições recarrega a pagina
                                            document.location.reload(true);
                                        });

                            }
                        }, 2000);
                    });
        });