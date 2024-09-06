declare module "@cred/neopop-web/lib/components" {
  export { default as Button } from "./Button/index";
  export { default as ElevatedCard } from "./ElevatedCard/index";
  export { default as Typography } from "./Typography/index";
  export { default as Tag } from "./Tags/index";
  export { default as Back } from "./Back/index";
  export { default as Header } from "./Header/index";
  export { default as Toggle } from "./Toggle/index";
  export { default as Radio } from "./Radio/index";
  export { default as Checkbox } from "./Checkbox/index";
  export { default as InputField } from "./InputField/index";
  export { default as SearchBar } from "./SearchBar/index";
  export {
    default as BottomSheet,
    BottomSheetCustom,
  } from "./BottomSheet/index";
  export { default as Dropdown } from "./Dropdown/index";
  export { default as ScoreMeter } from "./Scoremeter/index";
  export { default as Slider } from "./Slider/index";
  export { ToastContainer, showToast } from "./Toast/index";
  export {
    Chevron,
    Column,
    Cross,
    HorizontalDivider,
    HorizontalSpacer,
    PageContainer,
    Pointer,
    Row,
    VerticalSpacer,
  } from "./Helpers/index";
}

declare module "@cred/neopop-web/lib/primitives" {
  export { getButtonConfig } from "./buttons";
  export { getScoreMeterConfig } from "./scoremeter";
  export { colorGuide, colorPalette, extend, mainColors } from "./colors";
  export { FontVariant, fontNameSpaces, typographyGuide } from "./typography";
  export { SliderConfig, ThumbConfig } from "./slider";
  export { FontOpacity } from "./opacity";
}
