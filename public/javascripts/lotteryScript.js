function Ticket(id) {
    this.id = id
    this.numbers = []
    this.powerball = 0
    this.matching = 0
    this.powerballMatch = false
    this.price = 2

    this.getPrice = function () {
        return this.price
    }

    this.playerHTML = function () {
        return `
            <div class="lotteryNumbers" id="${this.id}">
                <div class="lotteryNumber smallLotteryNumber" id='b0'>${this.numbers[0]}</div>
                <div class="lotteryNumber smallLotteryNumber" id='b1'>${this.numbers[1]}</div>
                <div class="lotteryNumber smallLotteryNumber" id='b2'>${this.numbers[2]}</div>
                <div class="lotteryNumber smallLotteryNumber" id='b3'>${this.numbers[3]}</div>
                <div class="lotteryNumber smallLotteryNumber" id='b4'>${this.numbers[4]}</div>
                <div class="lotteryNumber smallLotteryNumber powerball" id="powerball">${this.powerball}</div>
            </div>
        `;
    }
    this.generateTicket = function () {
        numbers = []
        while (numbers.length < 5) {
            let newNumber = Math.floor(Math.random() * (70 - 1) + 1);
            if (!numbers.includes(newNumber)) {
                numbers.push(newNumber)
            }
        }
        numbers.sort(function (a, b) { return a - b })
        powerball = Math.floor(Math.random() * (28 - 1) + 1)
        this.numbers = numbers
        this.powerball = powerball
    }
    this.generateSelectedTicket = function() {
    }
}

function Lottery() {
    //Handles all Lottery logic
    //This includes the winning number logic, the total pot, and the total payout
    this.ticket = new Ticket()
    this.ticket.generateTicket()
    this.pot = 1000
    this.payout = 0

    this.generateWinningNumbers = function () {
        //Generates winning lottery number and compares it to the players numbers
        this.ticket.generateTicket()
        this.reset()
        this.compareNumbers()


        let doc = document
        let navBarElement = doc.getElementById('menuNavBar')
        doc.getElementById('footer').innerHTML = `<button onclick="lottery.resetNavBar()">Reset</button>`
        navBarElement.innerHTML = `<div class='menuNavButton'>Your total payout is $${this.payout} on ${player.tickets.length} tickets</div>`
        this.updateDOM()
    }

    this.resetNavBar = function () {
        //Resets the nav bar to default options instead of displaying payout to user
        let navBarElement = document.getElementById('menuNavBar')
        navBarElement.innerHTML = `
                <button class="menuNavButton" onclick="player.generateSelectTicket()">Pick New Ticket Number</button>
                <div>
                <button class="menuNavButton" onclick="player.generateRandomTicket()">Generate Random Ticket Number</button>
                <input type='text' value='' placeholder='Ticket quantity (max 1000)' id="ticketQuantity" max="99"></input>
                </div>
                <button class="menuNavButton" onclick="player.clearTickets()">Throw away your tickets :(</button>
                `
        document.getElementById('footer').innerHTML = `<button onclick="lottery.generateWinningNumbers()" id="generateWinningNumbersButton">Generate New Winning Numbers!</button>`
        player.clearTickets()

        player.balance += this.payout
        player.PL += this.payout
        this.payout = 0
        if (this.pot != 0) {
            console.log('Lottery Not balanced after payout')
        }
    }
    this.reset = function () {
        //Resets lottery number back to default view
        let lotteryElement = document.getElementById('lotteryNumbers')
        for (let i = 0; i < 5; i++) {
            lotteryElement.children[i].style.background = 'yellow'
        }
        lotteryElement.children[5].style.background = 'red'
    }
    this.compareNumbers = function () {
        //Compares players tickets to the winning number and issues payout
        for (let i = 0; i < player.tickets.length; i++) {
            let match = document.getElementById(String(i))
            let lptr = 0
            let pptr = 0
            //Uses pointers to navigate lottery numbers. Breaks at the end of either ticket
            while (lptr < 5 && pptr < 5) {
                //Numbers are matching, increments both ptrs and changes colors to green
                if (lottery.ticket.numbers[lptr] == player.tickets[i].numbers[pptr]) {
                    player.tickets[i].matching++
                    match.children[pptr].style.background = 'green'
                    document.getElementById('lotteryNumbers').children[lptr].style.background = 'green'
                    pptr++
                    lptr++
                }
                //Only increments the lower value
                else {
                    player.tickets[i].numbers[pptr] < lottery.ticket.numbers[lptr] ? pptr++: lptr++
                }
                //Changes the powerball to orange if it matches
                if (lottery.ticket.powerball == player.tickets[i].powerball) {
                    player.tickets[i].powerballMatch = true
                    match.children[5].style.background = 'orange'
                    document.getElementById('lotteryNumbers').children[5].style.background = 'orange'
                }
            }
            //uses payout variable to track total payout to player. DOES NOT ASSIGN TO PLAYER TILL THE WHILE LOOP BREAKS
            let payout = this.payoutFunds(player.tickets[i])
            if (payout == 'jackpot') {
                this.payout += Math.floor(this.pot * .60)
                break
            }
            else {
                this.pot -= payout
                payout = Math.round(payout * .60)
                this.payout += payout
            }
        }
        //Gives the total payout to the player
        player.pay(this.payout)
    }
    this.payoutFunds = function (ticket) {
        //Returns the payout of an individual ticket
        let powerballMatch = {
            5: 'jackpot',
            4: 50000,
            3: 100,
            2: 7,
            1: 4,
            0: 4
        }
        let noPowerBallMatch = {
            5: 1000000,
            4: 100,
            3: 7,
            2: 0,
            1: 0,
            0: 0,
        }
        if (ticket.powerballMatch) {
            return powerballMatch[ticket.matching]
        }
        return noPowerBallMatch[ticket.matching]
    }

    this.updateDOM = function(){
        let doc = document;
        let lotteryNumbersElement = doc.getElementById('lotteryNumbers')
        let lotteryNumbers = lotteryNumbersElement.children
        for (let i = 0; i < 5; i++) {
            lotteryNumbers[i].innerHTML = this.ticket.numbers[i]
        }
        let powerballElement = doc.getElementById('powerball')
        powerballElement.innerHTML = this.ticket.powerball

        let potElement = doc.getElementById('pot')
        potElement.innerHTML = this.pot
    }
}


function Player() {
    //Contains all player logic
    //Users balance, their PL, current tickets
    this.balance = 1000000
    this.PL = 0
    this.tickets = []
    this.render = ``

    this.doc = document

    //Setters and Getters
    //Balance
    this.setBalance = function (newBalance) {
        this.balance = newBalance
        this.updateDOM()
    }
    this.getBalance = function () {
        return this.balance
    }

    //PL
    this.setPL = function (newPL) {
        this.PL = newPL
        this.updateDOM()
    }
    this.getPL = function () {
        return this.PL
    }

    //Tickets
    this.addTicket = function (newTicket){
        this.tickets.push(newTicket)
    }
    this.getTicket = function (index) {
        return tickets[index]
    }

    //Inner HTML
    this.addToHTML = function (newHTML) {
        this.render += newHTML
    }
    this.generateRandomTicket = function () {
        let quantity = document.getElementById('ticketQuantity').value
        if (quantity > 1000) {
            alert('Maximum 1000 tickets at a time')
            return
        }
        for (let i = 0; i < quantity; i++) {
            ticket = new Ticket((this.tickets.length > 0) ? (this.tickets[this.tickets.length - 1].id + 1) : 0)
            ticket.generateTicket()
            this.addTicket(ticket)
            this.addToHTML(ticket.playerHTML())
        }
        this.setBalance(this.getBalance() - (ticket.getPrice() * quantity))
        this.setPL(this.getPL() - (ticket.getPrice() * quantity))
        lottery.pot += ticket.getPrice() * quantity
        this.updateDOM()
        lottery.updateDOM()
        
    }

    this.clearTickets = function () {
        this.tickets = []
        this.render = ``
        lottery.reset()
        this.updateDOM()
    }

    this.scrollDown = function () {
        let doc = document
        let scrollBar = doc.getElementById('lotteryTickets')
        scrollBar.scrollTop = scrollBar.scrollHeight;
    }

    this.generateSelectedTicket = function () {
        
    }

    this.updateDOM = function () {
        let doc = document
        let balanceElement = doc.getElementById('balance')
        let PLElement = doc.getElementById('PL')
        balanceElement.innerHTML = this.balance
        PLElement.innerHTML = this.PL

        document.getElementById('lotteryTickets').innerHTML = this.render
    }

    this.pay = function(payout){
        this.balance += payout
        this.PL += payout
        this.updateDOM()
    }
}


let lottery = new Lottery()
let player = new Player()

lottery.updateDOM()
player.updateDOM()
