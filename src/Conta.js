/* global selectors */

const Conta = {
    getSaldo: function () {
        let divSaldo = $(selectors.saldo);
        let saldo = divSaldo === null ? "R$0,00" : divSaldo.text();

        return Number(saldo.replaceAll(/[^0-9,]*/gm, "").replaceAll(",", "."));
    },
    login: new Promise((fezLogin, semLogin) => {
        //Espera o login por no maximo 2 segundos
        Wait.element(selectors.login_Btn, 2000)
                .then((login_Btn) => {
                    //Clica no botão de login
                    login_Btn.click();
                    Wait.element(selectors.login_BtnModal, 10000)
                            .then((login_BtnModal) => {
                                login_BtnModal.click();
                                return fezLogin();
                            });
                })
                .catch(() => {
                    //Não tem botão de login
                    return semLogin();
                });
    })
};

