<script>
    import { link } from "svelte-routing";
    import {Currency} from '@tatumio/tatum';
    export let currency = Currency.BTC;
    let accountNumber = ';'
</script>

<style>

</style>
<nav class="navbar navbar-expand-sm navBar2 pb-0">
    <ul class="navbar-nav">
        <li class="nav-item pl-122">
            <a class="nav-link nl2 subNavActive" href="/payment/send" use:link replace>Send</a>
        </li>
        <li class="nav-item m7 pl65">
            <a class="nav-link nl2" href="/payment/request" use:link replace>Request</a>
        </li>
    </ul>
</nav>

<div class="container-fluid containerMain mt-5">
    <div class="row">
        <div class="col-md-8 col-sm-12 col-12 pl-0">
            <div class="card sendPaymentCard">
                <div class="card-body cardp">
                    <div class="row">
                        <div class="col-12">
                            <h5 class="cardSubHeading">
                                Choose Account
                            </h5>
                            <div class="btns btnPay mb30-mt25">
                                <button id="btnBtc" class="btn btn-outline btnActive ml-0">BTC</button>
                                <button id="btnEth" class="btn btn-outline">ETH</button>
                            </div>
                            <h5 class="cardSubHeading">
                                Send Payment To
                            </h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 mtb10">
                            <input class="inputStyle" placeholder="Blockchain/Tatum address"/>
                        </div>
                        <div class="col-12 m5020">
                            <input class="inputStyle" id="amount" placeholder="Amount In BTC"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-12 mt-2">
                            <button class="btn btn-sub">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-sm-12 col-12 pl-0">

        </div>
    </div>
</div>
