# Sample of graphic 2D shapes

## Collisions of shapes

Collisions are calculated with different algorithms.
Should add a parameter for every collision which give a measure of the precision of the collision. This can be useful in case we need to compare two collision and decide which we should use to delete an element.

### Point and circle

The collision of a point and a circle is quite simple. We need to calculate the distance from the point and the center of the circle. If it's smaller or equal the radius the collision is true.

The formula to calculate the generic distance between two points is

<p align="center"><img src="/graphic-algebra/tex/c1e27e883bcc0f648b32cf3ddce962bd.svg?invert_in_darkmode&sanitize=true" align=middle width=228.22289159999997pt height=19.726228499999998pt/></p>

now we can test the condition <img src="/graphic-algebra/tex/036c42db226c966c405f71a31ce3ebfc.svg?invert_in_darkmode&sanitize=true" align=middle width=44.20064054999999pt height=22.55708729999998pt/> to have the result.


### Point and line

Suppose to have a line from the point **P1** to the point **P2** and another point **C**. We want to know if the point is on the line.
Let's start calculating the distance <img src="/graphic-algebra/tex/402b7f637df996b6a77cbcb6e5dc1287.svg?invert_in_darkmode&sanitize=true" align=middle width=105.94009965pt height=24.65753399999998pt/> and <img src="/graphic-algebra/tex/b0afcb9988c41b79515471cdef597f67.svg?invert_in_darkmode&sanitize=true" align=middle width=105.94009965pt height=24.65753399999998pt/> and compare it with <img src="/graphic-algebra/tex/da6e02a85a9e6d4ae181a1f778c1b952.svg?invert_in_darkmode&sanitize=true" align=middle width=104.02690154999999pt height=24.65753399999998pt/>. If the distance of the points is equal to the sum <img src="/graphic-algebra/tex/9f0bb87cb4a55f4b4b9f6a54af6eb8f6.svg?invert_in_darkmode&sanitize=true" align=middle width=92.41951289999999pt height=22.831056599999986pt/> the point is on the line.

It's useful to define a tolerance because of pixel approximation to detect the collision. Let's call it **T**; the higher it is the less accurate is the result. In our code the value is 0.1.

The conditon will be:

<p align="center"><img src="/graphic-algebra/tex/b47e11305ee322e8aaf9a94cbd459599.svg?invert_in_darkmode&sanitize=true" align=middle width=229.67927235pt height=16.438356pt/></p>
<br>

![Alt text](./pointAndLine.svg)
<img src="./pointAndLine.svg">

### Circle and line

The collision of a circle and line can be used to approximate the collision of a point wich rapresent moused coordinates. It's useful because we can calculate the closest point to the line, set a threshold and decide to "snap" the circle or have a over effect when the cursor is near the line.

Let's have a segment from P1 to P2 and a generic point C which will be the center of our circle. 
The closest point to C on the segment must obviusly stay between P1 and P2 and it is the intersection of the perpendiculer line from C to the segment itself. We call it C1.

C1 can be P1 or P2 or stay between them.

To identify the collision we want to have as a result a boolean that indicats if there is the collision with a threshold and two coordinates that indicates the closest point on the line.

We can proceed in three steps:

1. Check if P1 is inside the circle, if so the collision point is P1 (we can use the collision with circle and point).
2. Check if P2 is inside the circle, if so the collision point is P2.
3. Calculate the closest point C1 between P1 and P2 and check if it is actually on the segment.
4. Check if C1 is inside the circle, if so the collision point is C1.

**1.** and **2.** are described in the previous chapter. Here let's calculate the closest point on the segment from the center of the circle. As we can see in the picture below we want to know the projection of the center C on the segment **C1**.

![Semantic description of image]
(./graph.svg - "Image Title")


First of all we need to use the dot product of vectors to calculate the norm of the vector <img src="/graphic-algebra/tex/7b66a86581b623ad112c96c7a260b392.svg?invert_in_darkmode&sanitize=true" align=middle width=36.22950374999999pt height=31.799054100000024pt/>. This is the projection of <img src="/graphic-algebra/tex/9d969a32814c3ceb32bacfd10a357b53.svg?invert_in_darkmode&sanitize=true" align=middle width=30.852751049999988pt height=31.799054100000024pt/> on the unit vector with origin in <img src="/graphic-algebra/tex/197fa3a18e4a8b8c7df669d007476133.svg?invert_in_darkmode&sanitize=true" align=middle width=17.10619349999999pt height=22.465723500000017pt/> and direction equal to <img src="/graphic-algebra/tex/7b66a86581b623ad112c96c7a260b392.svg?invert_in_darkmode&sanitize=true" align=middle width=36.22950374999999pt height=31.799054100000024pt/>, we can call it <img src="/graphic-algebra/tex/2d758bdd2e564affd528927f4be7248f.svg?invert_in_darkmode&sanitize=true" align=middle width=14.206684799999989pt height=23.488575000000026pt/>.

First of all the norm of <img src="/graphic-algebra/tex/7432492d00cd171f60fc73f3874a4201.svg?invert_in_darkmode&sanitize=true" align=middle width=35.034301499999984pt height=31.799054100000024pt/> is:

<p align="center"><img src="/graphic-algebra/tex/6f97f649883825d899c297b88d802a63.svg?invert_in_darkmode&sanitize=true" align=middle width=307.97899275pt height=19.726228499999998pt/></p>

the unit vector is

<p align="center"><img src="/graphic-algebra/tex/a89d7bc900a010522fae3495a510ce25.svg?invert_in_darkmode&sanitize=true" align=middle width=74.77503659999999pt height=38.29608585pt/></p>

So

<img src="/graphic-algebra/tex/d73f4308523ad1cf9592bbd88efe4445.svg?invert_in_darkmode&sanitize=true" align=middle width=488.43344384999995pt height=35.83739279999998pt/>


now we need the two components on the **X** and **Y** axis of <img src="/graphic-algebra/tex/7b66a86581b623ad112c96c7a260b392.svg?invert_in_darkmode&sanitize=true" align=middle width=36.22950374999999pt height=31.799054100000024pt/>. So

<img src="/graphic-algebra/tex/b74a63039f31088f88f68694e516f777.svg?invert_in_darkmode&sanitize=true" align=middle width=206.45777459999996pt height=31.799054100000024pt/>

<img src="/graphic-algebra/tex/a15460e99554cb813d5ad07ef5f077cb.svg?invert_in_darkmode&sanitize=true" align=middle width=205.7471493pt height=31.799054100000024pt/>

where

<img src="/graphic-algebra/tex/656bd2a677c51e05a34df8bfd70a6e96.svg?invert_in_darkmode&sanitize=true" align=middle width=107.75102414999998pt height=28.734565200000006pt/>

<img src="/graphic-algebra/tex/0fb89ee6a9794699e40b8ee2da3b6d84.svg?invert_in_darkmode&sanitize=true" align=middle width=106.6240065pt height=28.734565200000006pt/>

Finally we have:

<img src="/graphic-algebra/tex/12575b91fd8f4a307429661b8b6efbec.svg?invert_in_darkmode&sanitize=true" align=middle width=355.87843664999997pt height=33.93596579999999pt/>

<img src="/graphic-algebra/tex/bfccb963bd15f10fce2d85d49e0e9139.svg?invert_in_darkmode&sanitize=true" align=middle width=351.4970019pt height=33.93596579999999pt/>

We need to check if the closest point **C1** is between P1 and P2 (it can be outside), we can use the **pointInLine** function. If true we can calculate the distance from the center **C** of the circle and test if is below a threshold. In positive case we have the collision.


### Point and polygon

