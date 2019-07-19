# Path Finding
This project is aimed towards finding the shortest path between two points in a grid with obstacles. To do so it uses multi-heuristic A* Algorithm and a html based user interface.
### Multi-Heuristic A* Algorithm
Heuristic A* is a search algorithm that is used extensively in path finding and graph traversal problems to find efficient paths through nodes. It enjoys a high use due to its efficiency and accuracy. A* achieves better performance by using heuristics to guide its search. 
> **Cost function** = Expenditure + Heuristic cost estimation

> **f(n) = g(n) + h(n)**

For this specific problem we are using 4 different heuristic functions:
- Manhattan Distance
- Euclidean Distance
- Horizontal Distance
- Vertical Distance 

The user can select the heuristic functions they prefer with suitable weights.

### About the Project

The entire logic is coded in Node.js along with basic HTML and CSS. It has following dependencies:

- Bootstrap 4.3.1
- jQuery 3.4.1

