{notifications.map(notif => (
    <ListItem 
      button 
      key={notif._id}
      onClick={() => navigate(notif.link)}
    >
      <ListItemIcon><AssignmentIcon /></ListItemIcon>
      <ListItemText 
        primary={notif.title} 
        secondary={notif.message} 
      />
    </ListItem>
  ))}