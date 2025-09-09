# Legend List Minimal Reproduction of Issue

This repo feautures an issue that I've noticed in the latest version of LegendList, which may be related. It is described below.

## Overlapping/Incomplete Content On Render
### Description

On some renders, you'll notice one of three things. Either overlapping content, an incomplete list, or both. The issue seems to resolve the moment the user scrolls.

![An example of the intial load looking incomplete and featuring overlapping elements. It goes away when scrolling starts.](/assets/images/issues/ll_overlapping_and_incomplete.mp4)

![Screenshot of the same phenomenon](/assets/images/issues/ll_overlap_example_1.png)

### How to reproduce

Without changing any of the config values, reload the simulator repeatedly by pressing R in your terminal. You will not reload 10 times before seeing an occurence of the issue.

This seems to happen when `MIN_HEADER_INDICES_SPACING` is set such that headers appear fairly regularly, but not close enough that two headers are simultaneously rendered when the list is initially loaded. 15 is a reliable place to start.

```typescript
const MIN_HEADER_INDICES_SPACING = 15
```
With sticky headers further apart, or none at all, the issue seems to stop.

