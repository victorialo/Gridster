import React, {useEffect, useState} from 'react';
// import logo from './logo.svg';
import styled from 'styled-components'
import './App.css';
import Box from './Box'
// import {render} from "react-dom";
import { find_path } from 'dijkstrajs';

const DimForm = styled.form`
  background-color: lightgray;
  padding: 10px;
  margin: 10px;
`
const DimInput = styled.label`
  margin: 5px;
  input {
    margin: 5px;
    max-width: 100px;
  }
`

const Grid = styled.div`
  background-color: lightgray;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 500px;
  margin: 0 auto;
`

const Key = styled.div`
  display: flex;
  justify-content: space-evenly;
`

function App() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [size, setSize] = useState("50px");
  // const [paths, setPaths] = useState(new Map());
  const [shortest, setShortest] = useState([]);
  const  [visited, setVisited] = useState([]);

  const pickStartEnd = () => {
    const start = Math.floor(Math.random() * (rows)) * cols;
    // const end = (Math.floor(Math.random() * rows )+ 1) * cols - 1;
    const end = Math.floor(Math.random() * rows) * cols + (cols - 1);
    let newBoxes = Array(rows * cols).fill("filled");
    newBoxes[start] = 'start';
    newBoxes[end] = 'end';
    setVisited([start, end]);
    // setBoxes(newBoxes);
    return newBoxes;
  }
  // const initializeBoxes = () => {
  //   // let newBoxes = new Array(rows).fill(new Array(cols).fill("filled"));
  //   // setBoxes(newBoxes);
  //   const newBoxes = new Array(rows * cols).fill("filled");
  //   // console.log(newBoxes);
  //   return pickStartEnd();
  // }
  const [boxes, setBoxes] = useState(pickStartEnd);
  // useEffect(calcSize, [rows, cols]);

  const calcSize = () => {
    // let wid = 1 / rows * 500;
    let hei = 1 / cols * 500;
    // console.log(wid);
    // const properSize = hei > wid ? `${wid}px` : `${hei}px`;
    // const properSize = ;
    // setSize(properSize);
    return `${hei}px`;
  }

  // const buildPath = (id, parents, weights, path, totalWeight) => {
  //   let lowestWeight = rows * cols;
  //   let lowestParent = null;
  //   console.log("id, parents, weights, path, totalweight", id, parents, weights, path, totalWeight);
  //   // handle when parents is null
  //   console.log("parents", parents, id, parents.has(id));
  //   if (parents.has(id)) {
  //     parents.get(id).forEach((p) => {
  //       console.log("parent, weight", p, weights[p]);
  //       if (weights[p] < lowestWeight) {
  //         lowestWeight = weights[p];
  //         lowestParent = p;
  //       }
  //     })
  //   } else {
  //     return [path, totalWeight];
  //   }
  //   console.log("lowest parent", lowestParent);
  //   path.push(lowestParent);
  //   totalWeight += lowestWeight;
  //   console.log("updated path, weight", path, totalWeight);
  //   return buildPath(lowestParent, parents, weights, path, totalWeight);
  // }
  //
  // const findShortestPath = (id, weights, parents, visited) => {
  //   console.log("id, weights, parents, visited", id, weights, parents, visited);
  //   // let adjacentSq = [boxes[id-1], boxes[id+1]];
  //   let adjacentSq = [];
  //   if (id % cols < cols-1) adjacentSq.push(id+1);
  //   if (id % cols > 0) adjacentSq.push(id-1);
  //
  //   if (id + cols < rows * cols) adjacentSq.push(id+cols);
  //   if (id - cols >= 0) adjacentSq.push(id-cols);
  //
  //   visited.push(id);
  //   console.log("adj", adjacentSq, "visited", visited);
  //   // let adjacentSq = [id-1, id+1, id+cols, id-cols];
  //   adjacentSq.forEach((s) => {
  //     weights[s] = weights[id]+1;
  //     if (s < 0 && s > rows * cols) {
  //       return;
  //     }
  //     if (boxes[s] === "clear") {
  //       // parents.push([id, s]);
  //       let currParents = parents.get(s);
  //       if (currParents) {
  //         currParents.push(id);
  //         parents.set(s, currParents);
  //       } else {
  //         parents.set(s, [id]);
  //         if (!visited.includes(s)) findShortestPath(s, weights, parents, visited)
  //       }
  //       console.log("parents", currParents, parents);
  //       // should i add a check here to see if weights exists and take the min???
  //       // weights[s] = weights[id]+1;
  //       // queue.push(s);
  //       // if (!visited.includes(id)) findShortestPath(id, weights, parents, visited);
  //     } else if ((boxes[s] === 'start' && visited.includes('end')) || (boxes[s] === 'end' && visited.includes('start')) ) {
  //       // if (visited.includes('start')) {
  //       //   // then u screwed up & found a loop. that is not a path gg rip
  //       //   return;
  //       // } else
  //       // if (visited.includes('end')) {
  //       //  u found a path good job.
  //       console.log("found a path");
  //       let [path, totalWeight] = [...buildPath(id, parents, weights, [id], 0)];
  //       console.log("new path", path, totalWeight);
  //       // paths[path] =
  //       paths.set(path, totalWeight);
  //       setPaths(paths);
  //       // const currentTop = paths.get(shortest);
  //       if (totalWeight < shortest[1]) {
  //         setShortest([path, totalWeight]);
  //         console.log("new shortest path");
  //       }
  //       // }
  //     }
  //   })
  //
  //   return shortest;
  // }

  const resetPath = (shortest) => {
    let newBoxes = [...boxes];
    shortest.forEach((i) => {
      if (!['start', 'end'].includes(newBoxes[i]) && (newBoxes[i] === 'shortest')) newBoxes[i] = 'clear';
    });
    setBoxes(newBoxes);
  }

  const findPath = (visited, boxes) => {
    let graph = {};
    console.log("visited", visited, boxes);
    const validTypes = ['clear', 'start', 'end'];
    visited.forEach((id) => {
      if (boxes[id] === 'filled') return;
      let adjacentSq = {};
      if (id % cols < cols-1 && validTypes.includes(boxes[id+1])) adjacentSq[id+1] = 1;
      if (id % cols > 0 && validTypes.includes(boxes[id-1])) adjacentSq[id-1] = 1;
      if (id + cols < rows * cols && validTypes.includes(boxes[id+cols])) adjacentSq[id+cols] = 1;
      if (id - cols >= 0 && validTypes.includes(boxes[id-cols])) adjacentSq[id-cols] = 1;
      graph[id] = adjacentSq;
      console.log(graph[id]);
    })
    console.log(graph);
    const start = boxes.findIndex((i) => i==='start');
    const end = boxes.findIndex((i) => i=== 'end');
    console.log('start, end', start, end);
    try {
      const path = find_path(graph, start, end);
      console.log(path);
      setShortest(path);
    } catch {
      resetPath(shortest, boxes);
      setShortest([]);
    }
    return;
  }

  const updateShortest = () => {
    const newBoxes = [...boxes];
    console.log(shortest);
    shortest.forEach((i) => {
      if (newBoxes[i] === 'clear') {
        newBoxes[i] = 'shortest';
      }
    })
    setBoxes(newBoxes);
  }
  // update path when add a new path
  useEffect(updateShortest, [shortest]);

  const verifyPath = (id, boxes, newVisited) => {
    console.log(boxes, id);
    let adjacentSq = [boxes[id-1], boxes[id+1]];
    if (id + cols < rows * cols) adjacentSq.push(boxes[id+cols]);
    if (id - cols >= 0) adjacentSq.push(boxes[id-cols]);
    console.log("adjacent", adjacentSq);

    // if ((adjacentSq.includes('start') || adjacentSq.includes('end')) && adjacentSq.includes('clear')) {
    if (adjacentSq.includes('start') || adjacentSq.includes('end')) {
      // time to check for path
      console.log("there's a clear and a start/end");
      // let visited = [];
      if (adjacentSq.includes('start')) newVisited.push('start');
      if (adjacentSq.includes('end')) newVisited.push('end');
      // let weights = {};
      // weights[id] = 1;
      // let parents = new Map();
      // console.log("visited", visited);
      // findShortestPath(id, weights, parents, visited);
    }
    // setVisited(newVisited);
    // console.log(newVisited, "new visits");

    if (newVisited.includes('start') && newVisited.includes('end')) {
      // check for a path
      findPath(newVisited, boxes);
    }

  }

  const changeColor = (e) => {
    // console.log("hi", e.currentTarget);
    e.preventDefault();
    const id = parseInt(e.target.id.split('-')[1]);
    if (['start', 'end'].includes(boxes[id])) return;
    let newBoxes = [...boxes];
    let newVisited = [...visited];
    // console.log("id", id);
    if (newBoxes[id] === 'filled') {
      newBoxes[id] = 'clear';
      newVisited.push(id);
    } else if (['clear', 'shortest'].includes(newBoxes[id])) {
      newBoxes[id] = 'filled';
      newVisited.filter((i) => i===id);
    }

    // console.log(newBoxes);
    setVisited(newVisited);
    setBoxes(newBoxes);
    console.log("new boxes", newBoxes);
    verifyPath(id, newBoxes, newVisited);
    // console.log(newBoxes);
    // createGrid(e);
    // const grid = createdGrid(newBoxes);
    // console.log(grid);
    // setDisplayGrid(grid);
    // return grid;
  }

  const createdGrid = () => {
    return (
      <Grid>
        {
          // [...Array(rows * cols)].map((_, i) => {
          boxes.map((status, i) => {
            // console.log(status);
            let div = <Box id={`box-${i}`} size={size} status={status} onClick={changeColor}/>
            return div;
          })
        }
      </Grid>
    )
  }
  const [displayGrid, setDisplayGrid] = useState(()=>createdGrid());

  const setDims = (event) => {
    // event.preventDefault;
    if (event.currentTarget.name === 'rows') {
      setRows(parseInt(event.currentTarget.value));
    } else {
      setCols(parseInt(event.currentTarget.value));
    }
  }
  const createGrid = (event) => {
    event.preventDefault();
    setSize(calcSize());
    setBoxes(pickStartEnd());
    // const grid = createdGrid();
    // setDisplayGrid(grid);
    // return grid;
  }
  const updateGrid = () => {
    setDisplayGrid(createdGrid());
  }
  useEffect(updateGrid, [boxes]);


  return (
    <div className="App">
      <img src={"https://media.discordapp.net/attachments/709331900204056661/723813188961042532/Gridster-Logo.png"} alt={"Gridster"}/>
      {/*<Input />*/}
      <div className={'input'}>
        <DimForm onSubmit={createGrid}>
          <DimInput>
            Rows
            <input type="number" name="rows" value={rows} onChange={setDims}/>
          </DimInput>
          <DimInput>
            Columns
            <input type="number" name="cols" value={cols} onChange={setDims} />
          </DimInput>
          <input type="submit" value={"Generate"}/>
        </DimForm>
      </div>
      {displayGrid}

      <h2>Key</h2>
      <Key>
        Filled <Box status={"filled"} size={size}/>
        Clear <Box status={"clear"} size={size}/>
        Start <Box status={"start"} size={size}/>
        End <Box status={"end"} size={size}/>
        Shortest Path <Box status={"shortest"} size={size}/>
      </Key>

    </div>
  );
}

export default App;
