import {useEffect, useRef} from "react";
import {STATE} from "../util";


const shapeClasses = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six"
}


function RollButton({ dice, setDice, setDiceHist, rolls, setRolls, gameState, setGameState }) {
  /**The button the user clicks to roll the dice. */
  useEffect(() => {
    if (rolls < 1) {
      setGameState(STATE.SCORING);
      setDice(dice.map(d => ({...d, ...{locked: false}})));
    }
  }, [rolls]);

  function getDieRoll() {
    return Math.trunc(Math.random() * 6) + 1;
  }

  function rollDice() {
    if ([STATE.SCORING, STATE.FINISH].includes(gameState)) return;
    if ([STATE.BEGIN, STATE.PREROLL].includes(gameState)) setGameState(STATE.ROLLING);
    
    if (rolls < 1) setRolls(3);
    
    const newDice = [];
    const forHistory = [];
    for (let die of dice) {
      if (die.locked) {
        newDice.push({...die, ...{new: false}});
      } else {
        const n = getDieRoll();
        newDice.push({value: n, locked: false, new: true});
        forHistory.push(n);
      }
    }
    setDice(newDice);
    setRolls(n => n - 1);
    setDiceHist(d => d.concat(forHistory));
  }

  function canRoll() {
    return [STATE.BEGIN, STATE.ROLLING, STATE.PREROLL].includes(gameState);
  }

  const buttonClass = `rollbtn${canRoll() ? "" : " locked noclick"}`;
  return (
    <button className={buttonClass} onClick={rollDice}>
      <div className="rolls-left">{rolls}</div>
      <div>Roll</div>
    </button>
    );
}


function DiceSection({ dice, setDice, rolls, gameState }) {
  /**The section containing the dice and roll button. */

  function setLockFactory(index) {
    const func = (value) => {
      if (gameState !== STATE.ROLLING) return;
      let newDice = dice.slice().map((d) => ({...d, ...{new: false}}));
      newDice[index] = {...newDice[index], ...{locked: value}};
      setDice(newDice);
    }
    return func;
  }

  return (
    <div className="dice-container">
      {dice.map(
        (die, i) => <Die 
            key={i} die={die} 
            setLock={setLockFactory(i)} rolls={rolls} />
        )}
    </div>
  );
}


function Die({ die, setLock, rolls }) {
  /**A single die in the game. */
  const dieClass = `die${die.locked ? " locked" : ""}`;
  const shapeClass = shapeClasses[die.value];
  const dieStyle = {animationDelay: `${Math.floor(Math.random()*100)}ms`};
  const shapeStyle = {transitionDelay: dieStyle["animationDelay"]};
  const dieRef = useRef(null);

  useEffect(() => {
    if (die.new) dieRef.current.classList.add("new");
  }, [rolls]);

  return (
    <div 
      ref={dieRef} 
      onAnimationEnd={() => dieRef.current.classList.remove("new")} 
      className={dieClass} 
      style={dieStyle} 
      onClick={() => setLock(!die.locked)}>
      <svg 
        className={shapeClass} 
        width="250" height="250" 
        viewBox="0 0 250 250" 
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect id="Square" width="250" height="250" rx="20"/>
        <circle className="dot1" style={shapeStyle} cx="60" cy="53" r="25"/>
        <circle className="dot2" style={shapeStyle} cx="189" cy="53" r="25"/>
        <circle className="dot3" style={shapeStyle} cx="60" cy="125" r="25"/> 
        <circle className="dot4" style={shapeStyle} cx="125" cy="125" r="25"/>
        <circle className="dot5" style={shapeStyle} cx="189" cy="125" r="25"/>
        <circle className="dot6" style={shapeStyle} cx="60" cy="197" r="25"/>
        <circle className="dot7" style={shapeStyle} cx="189" cy="197" r="25"/>
      </svg>
    </div>
  );
}


export {RollButton};
export default DiceSection;