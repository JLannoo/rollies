<h1 style="margin-top: 0px;">
	<span style="font-family: 'Title'; font-size: 4rem;">Rollies</span> - Roll your dice 
</h1>

Based on [Dice Parser](https://github.com/Rolisteam/DiceParser/blob/master/HelpMe.md)'s syntax but not all operators are supported yet.

Here's a list of the supported operators:

## Arithmetic Operators
Arithmetic operators (such as `+`, `-`, `*`, etc.) can be used and should work as expected.

Now, let's get into more specific operators.

## Roll (`d`)
Your most basic operator.  
Rolls an X amount of Y-sided dice.

### Syntax
```
XdY
X: The amount of dice to roll
Y: The amount of sides on the dice
```

### Example
```
2d6 -> Rolls two 6-sided dice
```

## Sort (`s` and `sl`)
Sorts the dice.  
`s`: ascending order.  
`sl`: descending order.

### Syntax
```
2d6s or 2d6sl
```

### Example
```
4d6s -> Rolls four 6-sided dice and sorts them in ascending order
```


## Keep highest (`k` or `kh`)
Used to keep the highest X dice from a roll.  

> Note: All `keep` operators sort the dice before keeping them.

### Syntax
```
2d6kX or 2d6khX

X: The amount of dice to keep
```

### Example
```
4d6k3 -> Rolls four 6-sided dice and keeps the highest three
```

## Keep lowest (`kl`)
Used to keep the lowest X dice from a roll.  

> Note: All `keep` operators sort the dice before keeping them.

### Syntax
```
2d6klX

X: The amount of dice to keep
```

### Example
```
4d6kl3 -> Rolls four 6-sided dice and keeps the lowest three
```

## Explode and Keep (`K`)
This one is a bit more complex.  
A dice "explodes" when it rolls its maximum value and can then be rolled again.  
This operator explodes a die until it doesn't roll its maximum value anymore and then keeps the highest X dice.  

> Note: All `keep` operators sort the dice before keeping them.

### Syntax
```
2d6KX

X: The amount of dice to keep
```

### Example
```
4d6K3 -> Selected: 15 (6, 6, 3), 10 (6, 4), 3, - Discarded: 2 
Rolls four 6-sided dice, explodes on 6s and keeps the highest three values
```

## Color Reference
<span class="dot" style="--color: #7eed7e;"></span> Critical  
<span class="dot" style="--color: #ea6363;"></span> Fail  
<span class="dot" style="--color: #616367;"></span> Discarded  

<br>