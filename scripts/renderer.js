const Renderer = {
    renderProjects: function (projects) {
        const projectGrid = document.getElementById('projectGrid');
        if (!projectGrid) return;

        projectGrid.innerHTML = projects.map(project => {
            const tagsHtml = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
            const linksHtml = project.links.map(link => `
                <a href="${link.url}" ${link.url.startsWith('http') ? 'target="_blank"' : ''} class="btn-link" title="${project.title} ${link.type} 보기">${link.type}</a>
            `).join('');

            return `
                <article class="project-card">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.imageAlt}" loading="lazy">
                    </div>
                    <div class="project-content">
                        <p class="project-role">${project.role}</p>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">
                            ${tagsHtml}
                        </div>
                        <div class="project-links">
                            ${linksHtml}
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }
};