import {useState, useEffect, useRef} from "react";
import {DieSVG, shapeClasses} from "./DiceSection";
import {TRAN, STATE} from "../util.js";


export default function Celebration({rolls, gameState, dice, yahtzeeWasRolled}) {
  /**The celebration animation that runs when user rolls a yahtzee. */
  const [tranState, setTranState] = useState(TRAN.HIDDEN);
  const transStateRef = useRef(null);

  function updateTranState(value) {
    transStateRef.current = value;
    setTranState(value);
  }

  useEffect(() => {
    if (![STATE.ROLLING, STATE.SCORING].includes(gameState)) return;
    if (yahtzeeWasRolled()) {
      updateTranState(TRAN.ENTER);
      const timeout1 = setTimeout(() => {if (transStateRef.current === TRAN.ENTER) updateTranState(TRAN.EXIT)}, 3000);
      const timeout2 = setTimeout(() => updateTranState(TRAN.HIDDEN), 5000);
      return () => {clearTimeout(timeout1); clearTimeout(timeout2);}
    };
  }, [rolls]);

  const stateClass = Object.entries(TRAN)[tranState][0].toLowerCase();
  return (
    <div className={`cele ${stateClass}`} onClick={() => updateTranState(TRAN.HIDDEN)}>
      <div key={Math.random()} className="bg">
        <div></div>
        <div></div>
      </div>
      <div className="dice-effect">
        {Array(5).fill(0).map((v, i) => {
          const style = {style: {animationDelay: `${Math.random()}s`}}
          return (
          <div key={Math.random()} className="die" {...style}>
            <DieSVG className={shapeClasses[dice[0].value]} />
          </div>
        )
        })}
        
      </div>
      <div className="text">
        {Array.from("YAHTZEE").map((v, i) => {
          return (
          <div key={Math.random()} className="letter" style={{animationDelay: `${.75 + (0.1 * i)}s`}}>
            {v}
          </div>
          )
        })}
      </div>
    </div>
  );
}
