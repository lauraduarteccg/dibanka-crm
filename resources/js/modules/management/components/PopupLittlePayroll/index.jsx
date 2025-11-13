import React, {useState, forwardRef} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useSpecialCasesForm } from "@modules/management/hooks/useSpecialCasesForm";
import { motion } from "framer-motion";

export default function PopupLittlePayroll({modal, setModal, selectedPayroll}) {
    const {user} = useSpecialCasesForm();
    const renderDescription = (text) => {
    if (!text) return null;

    // 1️⃣ Reemplazar {{agente}} por el nombre del agente
    const replacedText = text.replaceAll("{{agente}}", user.name ?? "");

    // 2️⃣ Separar por saltos de línea
    const lines = replacedText.split("\n");

    // 3️⃣ Renderizar cada línea con <br />
    return lines.map((line, index) => (
        <React.Fragment key={index}>
        {line}
        <br />
        </React.Fragment>
    ));
    }; 
  return (
    <Dialog onClose={() => setModal(false)} open={modal} className="max-w-3xl mx-auto">
        <DialogTitle className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-primary-strong bg-clip-text text-transparent"
              >
                Descripción de la pagaduría
              </motion.p>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-[200px]">
          {selectedPayroll?.name ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-blue-400 rounded-full min-h-[60px]"></div>
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="prose prose-blue max-w-none"
                    >
                      <div className="text-slate-700 leading-relaxed text-base">
                        {renderDescription(selectedPayroll.description)}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-2 border border-blue-100"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="font-medium">{selectedPayroll.name}</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center min-h-[200px] gap-4"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-4xl">📝</span>
              </motion.div>
              <p className="text-slate-400 text-lg font-medium">
                Seleccione una pagaduría
              </p>
              <div className="flex gap-2 mt-2">
                <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </motion.div>
          )}
        </DialogContent>
    </Dialog>
  )
}
