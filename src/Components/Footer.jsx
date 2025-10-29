import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import RoomIcon from "@mui/icons-material/Room";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import logoElCeibo from "../assets/Logos/elceibologo2-removebg-preview.png";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#B08968",
        color: "#fff",
        // mt: 5,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          justifyContent={{ xs: "center", md: "space-between" }}
          textAlign={{ xs: "center", sm: "left" }}
        >
          {/* Logo + descripción */}
          <Grid item xs={12} sm={6} md={3}>
            <Box mb={2} display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
              <img
                src={logoElCeibo}
                alt="logo el ceibo vivero"
                style={{ maxWidth: "150px", height: "auto" }}
              />
            </Box>
            <Typography variant="body2">
              Inspirá tus espacios con naturaleza y diseño.
            </Typography>
          </Grid>

          {/* Contacto con iconos */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contacto
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemIcon sx={{ color: "#fff", minWidth: 32 }}>
                  <RoomIcon />
                </ListItemIcon>
                <ListItemText primary="Córdoba, Argentina" />
              </ListItem>
              <ListItem disablePadding>
      <ListItemIcon sx={{ color: "#fff", minWidth: 32 }}>
        <WhatsAppIcon />
      </ListItemIcon>
      <ListItemText 
        primary={
          <a 
            href="https://wa.me/5493511234567?text=¡Hola!%20quiero%20consultar" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            +54 9 351 123 4567
          </a>
        } 
      />
    </ListItem>

              <ListItem disablePadding>
                <ListItemIcon sx={{ color: "#fff", minWidth: 32 }}>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="contacto@elceibo.com" />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Categorías
            </Typography>
            <Typography component="a" href="#" target="_blank"  sx={{textDecoration:'none' ,display: 'block' }} variant="body2">Plantas de interior</Typography>
            <Typography component="a" href="#" target="_blank"  sx={{textDecoration:'none' ,display: 'block' }} variant="body2">Plantas de exterior</Typography>
            <Typography component="a" href="#" target="_blank"  sx={{textDecoration:'none' ,display: 'block' }} variant="body2">Exóticas</Typography>
            <Typography component="a" href="#" target="_blank"  sx={{textDecoration:'none' ,display: 'block' }} variant="body2">Suculentas</Typography>
            <Typography component="a" href="#" target="_blank"  sx={{textDecoration:'none' ,display: 'block' }} variant="body2">Tropicales</Typography>
          </Grid>

          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Seguinos
            </Typography>
            <Typography variant="body2" mb={1}>
              Seguinos para más ideas.
            </Typography>
            <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }} gap={1}>
              <IconButton sx={{ color: "#fff" }} aria-label="Facebook" component="a" href="https://www.facebook.com/" target="_blank">
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: "#fff" }} aria-label="Instagram" component="a" href="https://www.instagram.com/" target="_blank">
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: "#fff" }} aria-label="Twitter" component="a" href="https://www.twitter.com/" target="_blank">
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ color: "#fff" }} aria-label="YouTube" component="a" href="https://www.youtube.com/" target="_blank">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* hr en mui se conoce como divider */}
        <Divider
          sx={{
            borderColor: "#e8d9cb", 
            mt: 4,
            mb: 2,
          }}
        />

        <Box textAlign="center">
          <Typography variant="caption" color="inherit">
            ©  2025 El Ceibo. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

