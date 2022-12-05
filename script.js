'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

//DISPLAY TRANSACTION HISTORY
const transactionHistory = function (account, sort = false) {
  // .textContent = 0
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  //LOOPING MOVEMENTS ARRAY
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const markup = `
  <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', markup);
  });
};
// transactionHistory(account1);

//CALCULATE BALANCE

const calcBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} €`;
};

// SHOW DEPOSITE, WITHDRAWAL AND INTRESTS
const calcDisplaySummery = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, inc) => acc + inc, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, inc) => acc + inc, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const intrest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, inc) => acc + inc, 0);

  labelSumInterest.textContent = `${intrest}€`;
};

// calcDisplaySummery(account1);

//CREATING USERNAMES FOR ALL ACCOUNTS

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(un => un[0])
      .join('');
  });
};
createUsername(accounts);
console.log(accounts);

//display UI
const displayUi = function (acc) {
  //DISPLAY MOVEMENTS
  transactionHistory(acc);

  //DISPLAY BALANCE
  calcBalance(acc);

  //DISPLAY SUMMARY
  calcDisplaySummery(acc);
};

//LOGIN

let correctAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  correctAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(correctAccount);

  if (correctAccount?.pin === Number(inputLoginPin.value)) {
    //DISPLAY UI AND MESSAGE
    containerApp.style.opacity = 100;

    labelWelcome.textContent = ` Welocome back! ${
      correctAccount.owner.split(' ')[0]
    }`;
  }

  //CLEAR INPUT FIELDS
  inputLoginUsername.value = inputLoginPin.value = '';

  inputLoginPin.blur();

  //display ui
  displayUi(correctAccount);
});

//TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const recieverAccount = accounts.find(
    e => e.userName === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  //clear
  inputTransferTo.value = inputTransferAmount.value = '';

  //conditions for Current User
  if (
    amount > 0 &&
    recieverAccount &&
    correctAccount.balance >= amount &&
    recieverAccount?.userName !== correctAccount.userName
  ) {
    //Doing Transfer
    correctAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    //Update UI
    displayUi(correctAccount);
  }
});

//CLOSE USER ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === correctAccount.userName &&
    Number(inputClosePin.value === correctAccount.pin)
  );
  {
    const index = accounts.findIndex(
      acc => acc.userName === correctAccount.userName
    );
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

//TAKING LOAN

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  //Conditions
  if (amount > 0 && correctAccount.movements.some(mov => mov >= amount * 0.1)) {
    //ADD AMOUNT TO MOVEMENTS
    correctAccount.movements.push(amount);

    //UPDATE UI
    displayUi(correctAccount);
  }

  inputLoanAmount.value = '';
});

//SORTING TRANSACTIONS
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  transactionHistory(correctAccount, !sorted);
  sorted = !sorted;
});
