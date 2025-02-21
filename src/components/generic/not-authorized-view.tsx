import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  logout: () => Promise<void>;
};

function NotAuthorizedView({ logout }: Props) {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        textAlign="center"
      >
        <Typography variant="h4" gutterBottom>
          {t("notAuthorizedView.notAuthorized")}
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          {t("notAuthorizedView.description")}
        </Typography>
        <Button onClick={() => logout()}>{t("logout")}</Button>
      </Box>
    </Container>
  );
}

export default NotAuthorizedView;
