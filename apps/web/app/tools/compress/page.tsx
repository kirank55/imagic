"use client";

import Disclosure from "components/layouts/Disclosure";
import ImageCompressComponent from "components/ui/ImageCompressComponent";

import FileInputContainer from "components/ui/FileInput";

export default function Compress() {

  return (
    <div className="converter-container">

      <FileInputContainer feature="Compressing"/>

      <ImageCompressComponent />

      <Disclosure />

      <div
        className="supported-formats-list"
        style={{ padding: "1em", textAlign: "center" }}
      >
        <h2>Supported Formats.</h2>

        <ol
          type="1"
          style={{
            maxWidth: "35px",
            marginInline: "auto",
            fontSize: "1.5em",
          }}
        >
          <li>JPG</li>
          <li>PNG</li>
          <li>BMP</li>
        </ol>
      </div>
    </div>
  );
}
