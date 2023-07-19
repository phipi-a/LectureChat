"use client";
import {
  privacyPolicy0,
  privacyPolicy1,
  privacyPolicy1Title,
  privacyPolicy2,
  privacyPolicy2Title,
  privacyPolicy3,
  privacyPolicy3Title,
  privacyPolicy4,
  privacyPolicy4Title,
  privacyPolicy5,
} from "@/common/Texts/signup";
import { Container, Typography } from "@mui/material";

export default function Page() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body2" gutterBottom whiteSpace={"pre-line"}>
        {privacyPolicy0}
      </Typography>

      <Typography variant="h6">{privacyPolicy1Title}</Typography>
      <Typography variant="body2" gutterBottom whiteSpace={"pre-line"}>
        {privacyPolicy1}
      </Typography>
      <Typography variant="h6">{privacyPolicy2Title}</Typography>
      <Typography variant="body2" gutterBottom whiteSpace={"pre-line"}>
        {privacyPolicy2}
      </Typography>
      <Typography variant="h6">{privacyPolicy3Title}</Typography>
      <Typography variant="body2" gutterBottom whiteSpace={"pre-line"}>
        {privacyPolicy3}
      </Typography>
      <Typography variant="h6">{privacyPolicy4Title}</Typography>
      <Typography variant="body2" gutterBottom whiteSpace={"pre-line"}>
        {privacyPolicy4}
      </Typography>
      <Typography variant="body2" gutterBottom whiteSpace={"pre-line"}>
        {privacyPolicy5}
      </Typography>
    </Container>
  );
}
