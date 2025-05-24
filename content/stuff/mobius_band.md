+++
title = "Warping a Image into a Mobius Loop"
date = "2024-12-30"
draft = false

summary = "A simple python script to warp an image into a Mobius loop"
description = "A simple python script to warp an image into a Mobius loop"
readTime = false
autonumber = false
math = false
tags = ["python", "math"]
showTags = false
hideBackToTop = false
fediverse = "@geoc@mathstodon.xyz"
+++

Me and the rest of the organizers of [SUMS 2025](https://sites.google.com/brown.edu/sums), a math symposium at Brown where we combine math + another field - in this case music, were working on making a poster for the event. 

I had head that Bach did a lot of work with symmetries (relefection, inversion, etc.) in his music and I had even heard that he incorporated a section that was essentially played on a Mobius loop. Since the loop is such a well known visual, I thought it would be fun to make a poster with music warped into a Mobius loop.

I couldn't find any good scripts to do this online, so I quickly bodged together a python script to do this.

The formula for a Mobius loop was pretty easy to come up with on Desmos:

<div align="center">

<iframe src="https://www.desmos.com/3d/gkjg1csncs?embed" width="100%" height="500" frameborder="0"></iframe>

</div>

```python
def mobius(u, v, band_size=0.5):
    def s1(u):
        return np.array([cos(u), sin(u), 0])
    def band(u, v):
        return v * np.array([0, cos(u), sin(u)]) + 
                (1 - v) * np.array([0, -cos(u), -sin(u)])

    return s1((tau * u)) + 
            (band(((tau * u) + (tau / 4)) / 2, v) * band_size)
```

But the rendering was a bit more difficult. Basically, it uses a 3D plot in matplotlib to render the loop and then it for each cell in the grid (or mesh) on the loop, it finds the color of the pixel in the image that corresponds to that cell. The downside is that it takes a while to render for large images but the upside is that you can actually rotate it around in the 3D plot.

<!-- ```python
    def render(self, elev=25, azim=-45, perspective=0.8, zoom=2.2, image_shift=0, res_factor=1, transparent=False, save=True):
        u, v = np.linspace(image_shift, 1 + image_shift, self.image_size[0] // res_factor), np.linspace(0, 1, self.image_size[0] // res_factor)
        u, v = np.meshgrid(u, v)

        coords = np.array([self(u_i, v_j) for u_i, v_j in zip(u.flatten(), v.flatten())])
        x, y, z = coords[:, 0].reshape(u.shape), coords[:, 1].reshape(u.shape), coords[:, 2].reshape(u.shape)

        u_img = (u * (self.image_array.shape[1] - 1)).astype(int)
        v_img = (v * (self.image_array.shape[0] - 1)).astype(int)
        colors = self.image_array[v_img % self.image_array.shape[0], u_img % self.image_array.shape[1]]

        if transparent:
            brightness = np.mean(colors, axis=-1)
            alpha = (brightness * 0.9)
            alpha = np.clip(alpha, 0.2, 1.0)
            colors = np.dstack((colors, alpha))
        else:
            colors = np.clip(colors, 0, 1)

        fig = plt.figure(figsize=(10, 10))
        ax = fig.add_subplot(111, projection='3d')

        mobius_loop = ax.plot_surface(x, y, z, facecolors=colors, rstride=1, cstride=1, antialiased=True, shade=True)

        ax.view_init(elev=elev, azim=azim)

        max_range = np.array([x.max() - x.min(), y.max() - y.min(), z.max() - z.min()]).max()
        mid = lambda coord: (coord.max() + coord.min()) / 2
        mid_x, mid_y, mid_z = mid(x), mid(y), mid(z) 

        scale = perspective / zoom
        ax.set_xlim(mid_x - max_range * scale, mid_x + max_range * scale)
        ax.set_ylim(mid_y - max_range * scale, mid_y + max_range * scale)
        ax.set_zlim(mid_z - max_range * scale, mid_z + max_range * scale)

        ax.axis('off')
        plt.show()

        if save:
            plt.savefig('mobius_strip_render.png', transparent=True, dpi=400)
``` -->

Here's the input image I used, [BWV 1087](https://youtu.be/WeWXmNy-Q7E?t=53):
![BWV1087](BWV1087.jpg)

and here's the output of the script, which is a 3D plot of the Mobius loop with the image warped around it:
![BWV1087](mobius_strip_render.png)

and the final poster:
![SUMS_poster](sums_poster.png)

