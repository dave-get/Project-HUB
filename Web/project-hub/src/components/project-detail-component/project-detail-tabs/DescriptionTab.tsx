"use client";

import React from "react";

const DescriptionTab = ({ description }: { description: string }) => {
  return (
    <section className="mb-6 ">
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Description
      </h2>
      <p className="w- text-muted-foreground whitespace-pre-wrap break-words">
        {description}
      </p>
    </section>
  );
};

export default DescriptionTab;
