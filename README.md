## Installation
### USE Node >= 18.20 <19 AND Python >=3.11 <3.12

## Install Python

### install python mac 3.11
```bash
$ brew install pyenv
$ pyenv install
$ pyenv global 3.11.0
$ python -V
Output: Python 3.11.0
$ which python
Output: /Users/xxxxxxxx/.pyenv/shims/python
```

### install python win 3.11
```bash
$ https://www.python.org/downloads/
```

## Install Project
```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


Format on git commit
action: [card] commit detail  

action:<br/>
    - build<br/>
    - chore<br/>
    - ci<br/>
    - docs<br/>
    - feat<br/>
    - fix<br/>
    - perf<br/>
    - refactor<br/>
    - revert<br/>
    - style<br/>
    - test
<br/><br/>
EX: git commit -m "feat: du-xxx create page xxx"