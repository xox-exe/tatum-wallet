<script>
    import {onMount} from 'svelte';
    import {navigate} from 'svelte-routing';
    import bcoinImg from "./images/BIcon.png";
    import ethImg from "./images/bIco2.png";
    import {
        Currency,
        generateWallet,
        createAccount,
        getTransactionsByCustomer,
        getAccountById,
        generateDepositAddress,
        getDepositAddressesForAccount, getTransactionsByAccount
    } from '@tatumio/tatum';
    import "./css/bootstrap.css"
    import "./css/main.css"

    export let filter = '';
    let btcAccount, ethAccount, btcAddress, ethAddress;
    let transactions = [];

    async function generateAccounts() {
        const btcMnemonic = await generateWallet(Currency.BTC, true);
        const ethMnemonic = await generateWallet(Currency.ETH, true);
        btcAccount = await createAccount({
            currency: Currency.BTC,
            xpub: btcMnemonic.xpub,
            accountingCurrency: 'USD',
            customer: {externalId: 'samuel.sramko@tatum.io'}
        })
        ethAccount = await createAccount({
            currency: Currency.ETH,
            xpub: ethMnemonic.xpub,
            accountingCurrency: 'USD',
            customer: {externalId: 'samuel.sramko@tatum.io'}
        })
        await generateDepositAddress(btcAccount.id);
        await generateDepositAddress(ethAccount.id);

        localStorage.setItem('CUSTOMER_ID', btcAccount.customerId);
        localStorage.setItem('BTC_ACCOUNT_ID', btcAccount.id);
        localStorage.setItem('ETH_ACCOUNT_ID', ethAccount.id);
        localStorage.setItem('BTC_WALLET', btcMnemonic.mnemonic);
        localStorage.setItem('ETH_WALLET', ethMnemonic.mnemonic);
    }

    function redirect(currency, isSendPage) {
        navigate(isSendPage ? `payment/send/${currency}` : `payment/request/${currency}`)
    }

    onMount(async () => {
        const customerId = localStorage.getItem('CUSTOMER_ID');
        const btcAccountId = localStorage.getItem('BTC_ACCOUNT_ID');
        const ethAccountId = localStorage.getItem('ETH_ACCOUNT_ID');
        btcAccount = await getAccountById(btcAccountId);
        ethAccount = await getAccountById(ethAccountId);
        btcAddress = (await getDepositAddressesForAccount(btcAccountId))[0];
        ethAddress = (await getDepositAddressesForAccount(ethAccountId))[0];
        transactions = await getTransactionsByCustomer({id: customerId});
    })

    async function getTransactionForAccount(currency) {
        const customerId = localStorage.getItem('CUSTOMER_ID');
        if (filter === currency) {
            transactions = await getTransactionsByCustomer({id: customerId});
            filter = '';
            return;
        }

        filter = currency;
        const accountId = currency === Currency.BTC ? localStorage.getItem('BTC_ACCOUNT_ID') : localStorage.getItem('ETH_ACCOUNT_ID');
        transactions = await getTransactionsByAccount({id: accountId});
    }
</script>

<style>

</style>

<div class="row">
    <div class="col-md-6 col-sm-12 col-12 pl-0">
        <h4 class="title">Your Wallets</h4>

        {#if btcAccount}
            <div class="card cardWalet">
                <div class="card-body cardBodyP20">
                    <div class="row">
                        <div class="col-12">
                            <h5 class="cardSubHeading">
                                BTC balance
                            </h5>
                        </div>
                    </div>
                    <div class="icoRight">
                        <span><img alt="btc" src="{bcoinImg}"></span>
                    </div>
                    <div class="row">
                        <div class="col-12 pl-0">
                            <h4 class="totalBalance mb-0">{btcAccount.balance.accountBalance} BTC</h4>
                            <p class="m-0 amountDol">${parseFloat(btcAccount.balance.accountBalance) * 12000}</p>
                            <p class="amountDol code pt-3">
                                {btcAddress ? btcAddress.address : ''}
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 col-12 col-sm-12">
                            <button class="btn btn-outlineSR w-sm-100" on:click={() => redirect('BTC', true)}>Send BTC
                            </button>
                        </div>
                        <div class="col-md-6 col-12 col-sm-12">
                            <button class="btn btn-outlineSR w-sm-100" on:click={() => redirect('BTC', false)}>Request
                                BTC
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
        {#if ethAccount}
            <div class="card cardWalet mt-4">
                <div class="card-body cardBodyP20">
                    <div class="row">
                        <div class="col-12">
                            <h5 class="cardSubHeading">
                                ETH balance
                            </h5>
                        </div>
                    </div>
                    <div class="icoRight">
                        <span><img alt="eth" src="{ethImg}"></span>
                    </div>
                    <div class="row">
                        <div class="col-12 pl-0">
                            <h4 class="totalBalance mb-0">{ethAccount.balance.accountBalance} ETH</h4>
                            <p class="m-0 amountDol">${parseFloat(ethAccount.balance.accountBalance) * 400}</p>
                            <p class="amountDol code pt-3">
                                {ethAddress ? ethAddress.address : ''}
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 col-12 col-sm-12">
                            <button class="btn btn-outlineSR w-sm-100" on:click={() => redirect('ETH', true)}>Send ETH
                            </button>
                        </div>
                        <div class="col-md-6 col-12 col-sm-12">
                            <button class="btn btn-outlineSR w-sm-100" on:click={() => redirect('ETH', false)}>Request
                                ETH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
        <p class="mt20">
            <a href="/#add" class="atag" on:click={generateAccounts}><i class="fa fa-plus-circle"></i> Add a wallet</a>
        </p>
    </div>
    {#if transactions.length}
        <div class="col-md-6 col-sm-12 col-12 pl-0">
            <h4 class="title">Latest Transactions</h4>
            <div class="btns mb20">
                <button class="btn btn-outline {filter === 'BTC' ? 'btn-outline-active' : ''}"
                        on:click={() => getTransactionForAccount('BTC')}>BTC
                </button>
                <button class="btn btn-outline {filter === 'ETH' ? 'btn-outline-active' : ''}"
                        on:click={() => getTransactionForAccount('ETH')}>ETH
                </button>
            </div>
            {#each transactions as transaction}
                <div class="card cardTrans mb30">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-9 pr5">
                                        <p class="date m-0">
                                            {new Date(transaction.created).toLocaleString()}
                                        </p>
                                        <p class="id m5-6">
                                            {transaction.address || transaction.counterAccountId}
                                        </p>
                                        <p class="m-0 id">
                                            <b>Transaction ID:</b> <span><a
                                                href="https://ropsten.etherscan.io/tx/{transaction.txId}"
                                                target="_blank">{transaction.txId}</a></span>
                                        </p>
                                    </div>
                                    <div class="col-3 pl-0">
                                        <p class="amt mb10">
                                            {transaction.amount} {transaction.currency}
                                        </p>
                                        <p class="amtDol">
                                            ${parseFloat(transaction.marketValue.amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>