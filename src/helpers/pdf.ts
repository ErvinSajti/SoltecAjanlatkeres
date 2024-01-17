import { UserType } from "../db/users";
import { PDFDocument } from "pdf-lib";
import pdfkit from "pdfkit";
import fs from "fs";

export const generatePdf = async (user: UserType) => {
  const filename = `src/pdf/pdf${user.consumption.toString()}.pdf`;
  try {
    const existingBytes = fs.readFileSync(filename);

    const pdf = await PDFDocument.load(existingBytes);

    const form = pdf.getForm();

    const nameField = form.getTextField("<név>");
    const locationField = form.getTextField("<telepítési cím>");
    const dateField = form.getTextField("<dátum>");

    nameField.setText(`${user.lastName} ${user.firstName}`);
    locationField.setText(
      `${user.installationLocation.zipCode} ${user.installationLocation.city} ${user.installationLocation.street} ${user.installationLocation.houseNumber}`
    );
    dateField.setText(new Date().toLocaleDateString());

    const pdfBytes = await pdf.save();
    fs.writeFileSync("ajanlatkeres.pdf", pdfBytes);
  } catch (error) {
    console.error(error);
  }
};

/**
 * This is the old approach, using pdfkit
 * Under changes, will be deprecated when the new approach is ready
 * using muhammaraJS
 * @param user UserType
 */
export const createPdfDocument = (user: UserType) => {
  const doc = new pdfkit({
    size: "A4",
  });

  doc.pipe(fs.createWriteStream("ajanlatkeres.pdf"));

  doc.info = {
    Title: "Soltec ajánlatkérés",
    Author: "Author",
    Subject: "Subject",
    Keywords: "Napelem",
    CreationDate: new Date(),
    ModDate: new Date(),
  };

  doc.options.permissions = {
    printing: "highResolution",
    modifying: false,
    copying: true,
  };

  const { firstName, lastName, email, installationLocation, consumption } =
    user;
  const { zipCode, city, street, houseNumber } = installationLocation;

  doc.text(`Név: ${lastName} ${firstName}`);
  doc.text(`Email cím: ${email}`);
  doc.text(`Telepítési cím: ${zipCode} ${city} ${street} ${houseNumber}.`);
  doc.text(`Fogyasztás: ${consumption}`);

  // Finalize the pdf and end the stream
  doc.end();
};
