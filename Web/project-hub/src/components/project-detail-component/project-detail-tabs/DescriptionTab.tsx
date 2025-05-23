"use client";

import React from "react";

interface DescriptionTabProps {
  description: string;
}

const DescriptionTab: React.FC<DescriptionTabProps> = ({ description }) => {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Description
      </h2>
      <p className="text-muted-foreground">{description}</p>
    </section>
  );
};

export default DescriptionTab;
