"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import styles from "./page.module.css";

type FormState = {
  sapWeightNo: string;
  vehicleNo: string;
  product: string;
  poNo: string;
  destination: string;
  transporter: string;
  shipNo: string;
  supplier: string;
  firstWeight: string;
  firstDate: string;
  secondWeight: string;
  secondDate: string;
  printedOn: string;
  barcodeTop: string;
  barcodeBottom: string;
};

const initialState: FormState = {
  sapWeightNo: "1300302108",
  vehicleNo: "KA52C0542",
  product: "RW-PLASTIC WASTE-MULTI LAYER PLASTIC",
  poNo: "4479001794",
  destination: "",
  transporter: "",
  shipNo: "",
  supplier: "Anand Resource Management",
  firstWeight: "12560",
  firstDate: "30-Apr-26 07:39:57 AM",
  secondWeight: "6150",
  secondDate: "30-Apr-26 16:09:50 PM",
  printedOn: "30-Apr-26 16:31:25 PM",
  barcodeTop: "1300302108",
  barcodeBottom: "KA52C0542",
};

const formatWeight = (value: string) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "";
  }

  return numeric.toLocaleString("en-IN", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};

const parseWeight = (value: string) => {
  const normalized = value.replaceAll(",", "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function Home() {
  const [data, setData] = useState<FormState>(initialState);
  const [isDownloading, setIsDownloading] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const netWeight = useMemo(() => {
    const first = parseWeight(data.firstWeight);
    const second = parseWeight(data.secondWeight);
    if (first === null || second === null) {
      return "";
    }

    return formatWeight(String(Math.abs(first - second)));
  }, [data.firstWeight, data.secondWeight]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((previous) => ({ ...previous, [name]: value }));
  };

  const downloadPdf = async () => {
    const node = documentRef.current;
    if (!node) {
      return;
    }

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(width / canvas.width, height / canvas.height);

      const renderWidth = canvas.width * ratio;
      const renderHeight = canvas.height * ratio;
      const x = (width - renderWidth) / 2;
      const y = (height - renderHeight) / 2;

      pdf.addImage(imageData, "PNG", x, y, renderWidth, renderHeight);
      pdf.save(`weighment-certificate-${Date.now()}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.formPanel}>
        <h1>Wayslip Document Generator</h1>
        <p>Fill the values below. Fixed labels and headers stay unchanged.</p>

        <div className={styles.formGrid}>
          <label>
            SAP WEIGHT NO.
            <input name="sapWeightNo" value={data.sapWeightNo} onChange={handleChange} />
          </label>
          <label>
            VEHICLE NO.
            <input name="vehicleNo" value={data.vehicleNo} onChange={handleChange} />
          </label>
          <label>
            PRODUCT
            <input name="product" value={data.product} onChange={handleChange} />
          </label>
          <label>
            PO NO.
            <input name="poNo" value={data.poNo} onChange={handleChange} />
          </label>
          <label>
            DESTINATION
            <input name="destination" value={data.destination} onChange={handleChange} />
          </label>
          <label>
            TRANSPORTER
            <input name="transporter" value={data.transporter} onChange={handleChange} />
          </label>
          <label>
            SHIP NO.
            <input name="shipNo" value={data.shipNo} onChange={handleChange} />
          </label>
          <label>
            SUPPLIER
            <input name="supplier" value={data.supplier} onChange={handleChange} />
          </label>
          <label>
            FIRST WEIGHT (Kgs)
            <input name="firstWeight" value={data.firstWeight} onChange={handleChange} />
          </label>
          <label>
            FIRST DATE
            <input name="firstDate" value={data.firstDate} onChange={handleChange} />
          </label>
          <label>
            SECOND WEIGHT (Kgs)
            <input name="secondWeight" value={data.secondWeight} onChange={handleChange} />
          </label>
          <label>
            SECOND DATE
            <input name="secondDate" value={data.secondDate} onChange={handleChange} />
          </label>
          <label>
            PRINTED ON
            <input name="printedOn" value={data.printedOn} onChange={handleChange} />
          </label>
          <label>
            TOP BARCODE DATA
            <input name="barcodeTop" value={data.barcodeTop} onChange={handleChange} />
          </label>
          <label>
            BOTTOM BARCODE DATA
            <input name="barcodeBottom" value={data.barcodeBottom} onChange={handleChange} />
          </label>
        </div>

        <button type="button" onClick={downloadPdf} disabled={isDownloading}>
          {isDownloading ? "Generating PDF..." : "Download Certificate (PDF)"}
        </button>
      </section>

      <section className={styles.previewPanel}>
        <div className={styles.document} ref={documentRef}>
          <header className={styles.header}>
            <div className={styles.titleBlock}>
              <h2 className={styles.headerLineOne}>DCBL FACTORY BELGAUM - 1300</h2>
              <h2 className={styles.headerLineTwo}>BELGAUM</h2>
              <h3 className={styles.headerLineThree}>WEIGHMENT CERTIFICATE</h3>
            </div>
          </header>

          <div className={styles.topPairRow}>
            <div className={styles.topLine}>
              <span className={styles.label}>SAP WEIGHT NO.:</span>
              <span className={styles.value}>{data.sapWeightNo}</span>
            </div>

            <div className={styles.barcodeBox}>
              <Barcode
                value={data.barcodeTop || "0"}
                displayValue
                width={1.25}
                height={24}
                fontSize={13}
                textAlign="left"
              />
            </div>
          </div>

          <div className={styles.topPairRow}>
            <div className={styles.topLine}>
              <span className={styles.label}>VEHICLE NO.:</span>
              <span className={styles.value}>{data.vehicleNo}</span>
            </div>

            <div className={styles.barcodeBox}>
              <Barcode
                value={data.barcodeBottom || "0"}
                displayValue
                width={1.25}
                height={24}
                fontSize={13}
              />
            </div>
          </div>

          <div className={styles.rows}>
            <div className={styles.row}>
              <span className={styles.label}>PRODUCT:</span>
              <span className={styles.value}>{data.product}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>PO NO.:</span>
              <span className={styles.value}>{data.poNo}</span>
            </div>
            <div className={styles.rowFour}>
              <span className={styles.label}>DESTINATION:</span>
              <span className={styles.value}>{data.destination}</span>
              <span className={styles.label}>SHIP NO.:</span>
              <span className={styles.value}>{data.shipNo}</span>
            </div>
            <div className={styles.rowFour}>
              <span className={styles.label}>TRANSPORTER:</span>
              <span className={styles.value}>{data.transporter}</span>
              <span className={styles.label}>SUPPLIER:</span>
              <span className={styles.valuePlain}>{data.supplier}</span>
            </div>
            <div className={styles.rowFour}>
              <span className={styles.label}>FIRST WEIGHT:</span>
              <span className={`${styles.value} ${styles.weightValue}`}>
                <span className={styles.weightNumber}>{formatWeight(data.firstWeight)}</span>
                <span className={styles.weightUnit}>Kgs.</span>
              </span>
              <span className={styles.label}>DATE:</span>
              <span className={styles.value}>{data.firstDate}</span>
            </div>
            <div className={styles.rowFour}>
              <span className={styles.label}>SECOND WEIGHT:</span>
              <span className={`${styles.value} ${styles.weightValue}`}>
                <span className={styles.weightNumber}>{formatWeight(data.secondWeight)}</span>
                <span className={styles.weightUnit}>Kgs.</span>
              </span>
              <span className={styles.label}>DATE:</span>
              <span className={styles.value}>{data.secondDate}</span>
            </div>
            <div className={`${styles.row} ${styles.netWeightRow}`}>
              <span className={styles.label}>NET WEIGHT:</span>
              <span className={`${styles.value} ${styles.weightValue}`}>
                <span className={styles.weightNumber}>{netWeight}</span>
                {netWeight ? <span className={styles.weightUnit}>Kgs.</span> : null}
              </span>
            </div>
          </div>

          <footer className={styles.footer}>
            <p>SIGNATURE OF OPERATOR</p>
            <p>SIGNATURE OF DRIVER</p>
          </footer>

          <p className={styles.printedOn}>Printed On {data.printedOn}</p>
        </div>
      </section>
    </div>
  );
}
