function toggleDetails(element) {
    const details = element.querySelector('.step-details');
    const isOpen = details.classList.contains('active');

    // Close all other open details
    document.querySelectorAll('.step-details.active').forEach(openDetail => {
        if (openDetail !== details) {
            openDetail.classList.remove('active');
            openDetail.closest('.workflow-step').classList.remove('open');
        }
    });

    // Toggle the clicked one
    details.classList.toggle('active');
    element.classList.toggle('open');
}

// Add this script to expand all sections by default on page load
document.addEventListener('DOMContentLoaded', function() {
    // This part is for the index.html page, might need separation if reused
    document.querySelectorAll('.workflow-step').forEach(step => {
        const details = step.querySelector('.step-details');
        if (details) {
            details.classList.add('active'); // Show details
        }
        step.classList.add('open'); // Set icon to 'open' state
    });

    // Add filter functionality if the airtable container exists
    if (document.querySelector('.airtable-container')) {
        setupFilters();
    }
});

function setupFilters() {
    // Add data-stage attributes to rows based on their stage
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const stageCell = row.querySelector('td:nth-child(2)');
        if (stageCell) {
            const stageText = stageCell.textContent.trim();
            // Extract the stage name and use it as a data attribute
            let stageName = '';
            if (stageText.includes('New Lead')) stageName = 'lead';
            else if (stageText.includes('Docs Collection')) stageName = 'docs';
            else if (stageText.includes('Application Submitted')) stageName = 'submitted';
            else if (stageText.includes('Approved')) stageName = 'approved';
            else if (stageText.includes('Completed')) stageName = 'completed';
            
            row.setAttribute('data-stage', stageName);
        }

        // Also add a data-needs-followup attribute based on next action
        const nextActionCell = row.querySelector('td:nth-child(8)');
        if (nextActionCell && nextActionCell.textContent.trim() !== '') {
            row.setAttribute('data-needs-followup', 'true');
        }
    });

    // Add click handlers to view tabs
    const viewTabs = document.querySelectorAll('.view-tab');
    viewTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            viewTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the filter type from the tab text
            const filterType = this.textContent.trim();
            
            // Show/hide rows based on filter
            filterRows(filterType);
        });
    });
}

function filterRows(filterType) {
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        // Default to showing the row
        let shouldShow = true;
        
        // Apply filters based on the selected tab
        switch(filterType) {
            case 'All Clients':
                // Show all rows
                shouldShow = true;
                break;
            case 'Pending Documents':
                // Show only rows in docs collection stage with incomplete docs
                shouldShow = row.getAttribute('data-stage') === 'docs' || 
                             (row.getAttribute('data-stage') === 'lead');
                break;
            case 'Submitted Applications':
                // Show only rows in submitted stage
                shouldShow = row.getAttribute('data-stage') === 'submitted';
                break;
            case 'Approvals':
                // Show only rows in approved stage
                shouldShow = row.getAttribute('data-stage') === 'approved';
                break;
            case 'Follow-ups Needed':
                // Show only rows that need follow-up
                shouldShow = row.getAttribute('data-needs-followup') === 'true';
                break;
        }
        
        // Show or hide the row
        row.style.display = shouldShow ? '' : 'none';
    });
} 