import * as React from "react";
import {Box} from "@chakra-ui/react";

const BoxSliderForScrollModel: React.FC<{
  viewBoxWidth: string;
  scrollPercentage: number;
  viewBoxWidthInverse: string;
}> = ({scrollPercentage, viewBoxWidth, viewBoxWidthInverse}) => {
  return (
    <Box
      w={viewBoxWidth}
      h="8rem"
      position="absolute"
      bottom="0"
      left={`calc(${scrollPercentage} * ${viewBoxWidthInverse})`}
      border="3px solid black"
      borderRadius="3px"
      zIndex="4"
    />
  );
};

export {BoxSliderForScrollModel};
