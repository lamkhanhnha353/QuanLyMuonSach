# TODO: Add Admin Layout Customization to StaffOverview.vue

## Steps to Complete:
- [ ] Add admin role check in StaffOverview.vue data and computed properties
- [ ] Add "Customize Layout" button in the header section, visible only to admins
- [ ] Create a modal component with checkboxes for each section (Quick Actions, Statistics Cards, Today's Tasks, Books Due Today & Overdue, Recent Activities)
- [ ] Implement methods to load and save layout preferences from localStorage
- [ ] Update template to conditionally render sections based on user preferences
- [ ] Add default preferences for first-time users or non-admins
- [ ] Test the functionality: ensure modal opens, preferences save/load correctly, sections toggle visibility
