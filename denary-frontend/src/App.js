import React from 'react';
import './App.css';

import Reel from 'react-reel'
const theme = {
    

      reel: {
        boxSizing: 'border-box',
        height: "1em",
        display: "flex",
        alignItems: "flex-end",
        overflowY: "hidden",
        fontSize: '360px',
        fontWeight: "300",
        lineHeight: "1em"
      },
      group: {
        boxSizing: 'border-box',
        transitionDelay: "0ms",
        transitionTimingFunction: "ease-in-out",
        transform: "translate(0, 0)",
        height: "1em"
      },
      number: {
        backgroundColor: '#f9eb8c',
        backgroundImage: "url('block-bg.png')",
        backgroundSize: "cover",
        boxSizing: 'border-box',
        height: "1em",
        borderTop: "2px solid #745604",
        borderBottom: "2px solid #745604"
      }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amountToWin: null,
            currencyA: null,
            currencyB: null,
            insertedCoins: 0,
            winStatus: null,
            lowestCurrencyA: 3, // control lowest possibly number of currency a and currency b
            lowestCurrencyB: 1,
            highestAmount: 50,
            isFinishBtnDisabled: true,
            isStartBtnDisabled: false,
            showingResultTime: 3000,// control duration of result showing in ms
        }
        
    }

    componentDidMount () {
        const ws = new WebSocket("ws://localhost:3033");
        ws.onopen = () => console.log("Online")
        ws.onclose = () => console.log("Disconnected")
        ws.onmessage = (response) => {this.handleMessage(response.data)}
    }

    handleMessage =  (message) => {
        if (message === 'coinReaderAction') {
            let currentInsertedCoins = this.state.insertedCoins + 1
            this.setState({insertedCoins: currentInsertedCoins})
        } else if (message === 'buttonAction') {
            this.onFinishButton()
        } else if (message === 'leverAction') {
            this.onStartButton()

        }
    }

    onStartButton = () => {
        this.setState({
            insertedCoins: 0,
            amountToWin: this.randomizeAmount(),
            currencyA: Math.floor(Math.random() * 10 + this.state.lowestCurrencyA),
            currencyB: Math.floor(Math.random() * 3 + this.state.lowestCurrencyB),
            // winStatus: "Wrzucaj monety",
            isFinishBtnDisabled: false,
            isStartBtnDisabled: true
        })
    }
    onFinishButton = () => {
        this.setState({
            winStatus: this.checkWin(),
            isFinishBtnDisabled: true,
            isStartBtnDisabled: true
        })
        setTimeout(
            () => {
                this.setState({
                    insertedCoins: 0,
                    amountToWin: null,
                    currencyA: null,
                    currencyB: null,
                    winStatus: "",
                    isStartBtnDisabled: false
                })
            }, this.state.showingResultTime)

    }

    randomizeAmount = () => {
        setTimeout(() => {
            let randomizedAmountToWin = Math.floor(Math.random() * this.state.highestAmount + 1)
            while (randomizedAmountToWin % this.state.currencyA !== 0) {
                randomizedAmountToWin++
                if (randomizedAmountToWin === this.state.currencyA) {
                    randomizedAmountToWin *= 2
                }
            }
            this.setState({amountToWin: randomizedAmountToWin})
        }, 50)

    }

    checkWin = () => {
        let requiredCoinsCount = this.state.amountToWin / this.state.currencyA * this.state.currencyB
        if (this.state.insertedCoins === requiredCoinsCount) {
            return 'Brawo!'
        } else if (this.state.insertedCoins < requiredCoinsCount) {
            return 'Za mało!'
        } else if (this.state.insertedCoins > requiredCoinsCount) {
            return 'Za dużo!'
        }
    }

    render() {
        return (
            <main className="main">
                <div className="inserted block">
                        <span className="inserted__number">{this.state.insertedCoins}</span>
                </div>
                <div className="top-right__wrapper">
                    <div className="result block">
                        {this.state.winStatus && <span className="result__text">{this.state.winStatus}</span>}
                    </div>

                    <div className="currency">
                        <div className="currency__a block">
                            {this.state.currencyA !== null &&
                            <span className="currency__number"><Reel delay={100} duration={2000} theme={theme} text={this.state.currencyA.toString()}/></span>}
                        </div>
                        <div className="currency__b block">
                            {this.state.currencyB !== null &&
                            <span className="currency__number"><Reel delay={100} duration={2500} theme={theme}  text={this.state.currencyB.toString()} /></span>}
                        </div>
                    </div>
                </div>

                <div className="bottom__wrapper">
                    <div className="amount block">
                        {this.state.amountToWin && <span className="amount__number">
                            <Reel delay={100} duration={3500} theme={theme}  text={this.state.amountToWin.toString()} /></span>}
                    </div>

                    <div className="buttons__wrapper">
                        {/* <button onClick={this.onStartButton}
                                disabled={this.state.isStartBtnDisabled}
                                type="button"
                                className="buttons__start">Start
                        </button>
                        <button onClick={this.onFinishButton}
                                disabled={this.state.isFinishBtnDisabled}
                                type="button"
                                className="buttons__check">Gotowe
                        </button> */}
                    </div>
                </div>
            </main>
        );
    }
}

export default App;
