import re

with open('people/index.html', 'r') as f:
    lines = f.readlines()

new_lines = []
in_grid = False
grid_articles = []
grid_start_idx = -1

def sort_articles(articles):
    with_photo = []
    without_photo = []
    for line in articles:
        if 'person-photo--empty' in line:
            without_photo.append(line)
        else:
            with_photo.append(line)
    return with_photo + without_photo

for i, line in enumerate(lines):
    if 'class="people-grid"' in line:
        new_lines.append(line)
        in_grid = True
        grid_articles = []
        continue
    
    if in_grid:
        if line.strip() == '</div>':
            # End of grid
            sorted_articles = sort_articles(grid_articles)
            new_lines.extend(sorted_articles)
            new_lines.append(line)
            in_grid = False
        elif line.strip().startswith('<article'):
            grid_articles.append(line)
        else:
            # Maybe there are other things in the grid? Just in case, if it's not an article, end the collection?
            # Actually, looking at the HTML, the articles are directly inside the grid.
            if line.strip() == '': continue
            grid_articles.append(line)
    else:
        new_lines.append(line)

with open('people/index.html', 'w') as f:
    f.writelines(new_lines)
