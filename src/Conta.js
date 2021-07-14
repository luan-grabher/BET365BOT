const Conta = {
    getSaldo: function () {
        let divSaldo = document.querySelector(selectors.saldo);
        let saldo = divSaldo === null ? "R$0,00" : divSaldo.innerText;

        saldo = saldo.replaceAll(/[^0-9,]*/gm, "").replaceAll(",", ".");

        return Number(saldo);
    },
    login: function () {
        let btnLogin = document.querySelector(selectors.loginBtn);
        //Se tiver o botão de login
        if (btnLogin !== null) {
            //clica no botao de login do header
            btnLogin.click();
            setTimeout(function () {
                //clica no login do modal
                clickIfNotNull(selectors.loginBtnModal);
            }, 1000);
        }
    }
};

