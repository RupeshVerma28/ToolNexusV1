import React from "react";
const ToolModal = ({ tool, onClose }) => {
  const renderTool = () => {
    switch (tool.id) {
      case "calc":
        return <Calculator />;
      case "voltage":
        return <VoltageConverter />;
      case "bmi":
        return <BMICalculator />;
      case "currency":
        return <CurrencyConverter />;
      case "counter":
        return <Counter />;
      case "stopwatch":
        return <Stopwatch />;
      case "img2pdf":
        return <ImageToPDF />;
      case "roman":
        return <RomanConverter />;
      case "pdfmerge":
        return <MergePDF />;
      case "imgresize":
        return <ImageResizer />;
      case "imgcompress":
        return <ImageCompressor />;
      case "imgflip":
        return <ImageFlipper />;
      case "percent":
        return <PercentageCalculator />;
      case "texteditor":
        return <TextEditor />;
      case "merge":
        return <MergePDF />;
      case "compress":
        return <CompressPDF />;
      case "text2pdf":
        return <TextToPDF />;
      case "split":
        return <SplitPDF />;
      case "qrcode":
        return <QRCodeGenerator />;
      case "countdown":
        return <CountdownTimer />;
      case "length":
        return <LengthConverter />;
      case "area":
        return <AreaConverter />;
      case "volume":
        return <VolumeConverter />;
      case "water":
        return <WaterIntake />;
      case "bmr":
        return <BMRCalculator />;
      case "ideal":
        return <IdealWeight />;
      case "imgcrop":
        return <ImageCropper />;
      case "agecalc":
        return <AgeCalculator />;
      case "speed":
        return <SpeedConverter />;
      case "energy":
        return <EnergyConverter />;
      case "sackadainterest":
        return <SackadaInterest />;
      case "simpleinterest":
        return <SimpleInterest />;
      case "compoundinterest":
        return <CompoundInterest />;
      case "emi":
        return <EMICalculator />;
      case "weight":
        return <WeightConverter />;
      case "temperature":
        return <TemperatureConverter />;
      case "textformatter":
        return <TextFormatter />;
      case "jsonformat":
        return <JsonFormatter />;
      case "imgformat":
        return <ImageFormatConverter />;
      default:
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
            {" "}
            <h3 className="text-2xl font-semibold text-white mb-4">
              {" "}
              {tool.title}{" "}
            </h3>{" "}
            <p className="text-gray-400 text-sm mb-4">{tool.desc}</p>{" "}
            <div className="text-center text-gray-500">
              {" "}
              <p>This tool is coming soon!</p>{" "}
              <p className="text-sm mt-2">
                {" "}
                We're working on implementing this feature.{" "}
              </p>{" "}
            </div>{" "}
          </div>
        );
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {" "}
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {" "}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          {" "}
          <h2 className="text-2xl font-bold text-white">{tool.title}</h2>{" "}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            {" "}
            ×{" "}
          </button>{" "}
        </div>{" "}
        <div className="p-6">{renderTool()}</div>{" "}
      </div>{" "}
    </div>
  );
};

import Calculator from "./tools/Calculator";
import BMICalculator from "./tools/BMICalculator";
import CurrencyConverter from "./tools/CurrencyConverter";
import Counter from "./tools/Counter";
import Stopwatch from "./tools/Stopwatch";
import RomanConverter from "./tools/RomanConverter";
import PercentageCalculator from "./tools/PercentageCalculator";
import TextEditor from "./tools/TextEditor";
import QRCodeGenerator from "./tools/QRCodeGenerator";
import CountdownTimer from "./tools/CountdownTimer";
import LengthConverter from "./tools/LengthConverter";
import AreaConverter from "./tools/AreaConverter";
import VolumeConverter from "./tools/VolumeConverter";
import WaterIntake from "./tools/WaterIntake";
import BMRCalculator from "./tools/BMRCalculator";
import AgeCalculator from "./tools/AgeCalculator";
import SpeedConverter from "./tools/SpeedConverter";
import EnergyConverter from "./tools/EnergyConverter";
import IdealWeight from "./tools/IdealWeightCalculator";
import VoltageConverter from "./tools/VoltageConverter";
import TextToPDF from "./tools/TextToPDF";
import ImageCropper from "./tools/ImageCropper";
import ImageCompressor from "./tools/ImageCompressor";
import MergePDF from "./tools/MergePDF";
import ImageToPDF from "./tools/ImageToPDF";
import ImageResizer from "./tools/ImageResizer";
import ImageFlipper from "./tools/ImageFlipper";
import SplitPDF from "./tools/SplitPDF";
import CompressPDF from "./tools/CompressPDF";
// New Tools
import SimpleInterest from "./tools/SimpleInterest";
import SackadaInterest from "./tools/SackadaInterest";
import CompoundInterest from "./tools/CompoundInterest";
import EMICalculator from "./tools/EMICalculator";
import WeightConverter from "./tools/WeightConverter";
import TemperatureConverter from "./tools/TemperatureConverter";
import TextFormatter from "./tools/TextFormatter";
import JsonFormatter from "./tools/JsonFormatter";
import ImageFormatConverter from "./tools/ImageFormatConverter";

export default ToolModal;
