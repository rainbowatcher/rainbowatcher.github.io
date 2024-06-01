---
layout: Post
title: 冒泡排序及鸡尾酒排序算法
date: 2022-07-17
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/algorithm.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [Algorithm, Sort, Java]
---

## 冒泡排序

冒泡排序英文叫做 Bubble sort，类属于交换排序。

### 思想

从左到右把相邻的元素两两比较，当一个元素大于右侧相邻元素时，交换它们的位置；当一个元素小于或等于右侧相邻元素时，位置不变。

![冒泡排序](https://www.runoob.com/wp-content/uploads/2019/03/bubbleSort.gif)

<Align place='center'> 图片来源：<a href="https://www.runoob.com/w3cnote/bubble-sort.html">菜鸟教程</a> </Align>

### 经典实现

```java
import java.util.Arrays;

public class BubbleSort0 {

  public static void main(String[] args) {
    int[] arr = new int[] { 9, 7, 2, 6, 5 };
    System.out.println(Arrays.toString(arr));
    sort(arr);
  }

  public static void sort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
      for (int j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          int tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
        }
      }
    }
  }
}
```

可以理解为存在两个指针，一个是 `arr[j]`，另一个是 `arr[j + 1]`。
两个指针同时从左到右遍历数组，每前进一位比较一次两者的大小，如果前者大于后者则双方调换位置。

::: tip 第一个循环中遍历次数为什么是 arr.length - 1？

下标`i`是从 0 开始，假设数组长度为 3，则 `arr.length - 1` 的值为 2，0 和 1 都满足条件，循环会执行两次。
且因为数组中的数都是两两比较，假设有三个数，那么最多能比较两次。所以比较次数是 `n-1`。

:::

::: tip 第二个循环中遍历次数为什么是 arr.length - i - 1?

冒泡排序有一个特点，就是每一次外层循环都会将数组末尾的一个数变得有序。

比如上面程序中的 `[9, 7, 2, 6, 5]`，
在第一次外层循环结束后会变成 `[7, 2, 6, 5, 9]`，
第二次外层循环结束会变成 `[2, 6, 5, 7, 9]`。

也就是说第一次外层循环结束时，数组中的最后一个位置的数一定是数组中最大的，
第二次外层循环结束后，倒数第二个位置的数一定是数组中仅次于最大值的数，以此类推。
所以每一次外层循环结束，内层循环的大小可以减 1 来避免多余的比较，这里 `-i` 可以达到这个效果。

至于末尾的 `-1` 是因为两两比较最后一位数字没有可比较的对象。

:::

### 优化版 1

```java
import java.util.Arrays;

public class BubbleSort1 {

  public static void main(String[] args) {
    int[] arr = new int[] { 3, 4, 2, 1, 5, 6, 7, 8 };
    System.out.println(Arrays.toString(arr));
    sort(arr);
  }

  public static void sort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
      // 有序标记
      boolean isSorted = true;
      for (int j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          int tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          // 进入if语句证明元素无序
          isSorted = false;
        }
      }
      if (isSorted) {
        break;
      }
    }
  }
}
```

冒泡排序在进行排序是会对元素进行值交换，
如果值是有序的，那么就不会运行交换代码块，
如果没有运行交换值的代码，就是说明数组已经是有序的状态
也就是可以提前结束排序了。这里就利用了这个特征减少了一定的循环次数。

### 优化版 2

```java
import java.util.Arrays;

public class BubbleSort2 {

  public static void main(String[] args) {
    int[] arr = new int[] { 3, 4, 2, 1, 5, 6, 7, 8 };
    sort(arr);
  }

  public static void sort(int[] arr) {
    // 记录最后一次交换的位置
    int lastExchangeIndex = 0;
    // 无序数组的边界
    int sortBorder = arr.length - 1;

    for (int i = 0; i < arr.length - 1; i++) {
      boolean isSorted = true;
      for (int j = 0; j < sortBorder; j++) {
        if (arr[j] > arr[j + 1]) {
          int tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          isSorted = false;
          // 更新为最后一次交换元素的位置
          lastExchangeIndex = j;
        }
      }
      sortBorder = lastExchangeIndex;
      if (isSorted){
        break;
      }
    }
  }
}
```

上一版在减少了外层循环的次数，这一版是优化了内层循环的比较次数，
即记录下上一次比较时最后交换值的坐标，如果后续都没有在做交换操作，那就说明后续的元素已经有序，就可以不在进行比较。

### 鸡尾酒排序

```java
import java.util.Arrays;

public class CocktailSort {

  public static void main(String[] args) {
    int[] arr = new int[] { 3, 4, 2, 1, 5, 6, 7, 8 };
    sort(arr);
  }

  public static void sort(int[] arr) {
    int tmp = 0;
    for (int i = 0; i < arr.length / 2; i++) {
      boolean isSorted = true;
      // 奇数轮，从左到右
      for (int j = i; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          isSorted = false;
        }
      }
      if (isSorted) {
        break;
      }

      isSorted = true;
      // 偶数轮
      for (int j = arr.length - i - 1; j > i; j--) {
        if (arr[j] < arr[j - 1]) {
          tmp = arr[j];
          arr[j] = arr[j - 1];
          arr[j - 1] = tmp;
          isSorted = false;
        }
      }
      if (isSorted) {
        break;
      }
    }
  }
}
```

冒泡排序默认是从左到右遍历数组，鸡尾酒排序奇数轮与偶数轮遍历方向相反，从而优化了某些特殊场景的排序时间复杂度。

### 边界优化的鸡尾酒排序

```java
import java.util.Arrays;

public class OptimizedCocktailSort {

  public static void optimizedCocktailSort(int[] arr) {
    int tmp = 0;
    // 记录最后一次交换的位置
    int lastExchangeIndex = 0;
    // 顺序无序数组的边界
    int leftSortBorder = arr.length - 1;
    // 逆序无序数组的边界
    int rightSortBorder = 0;
    for (int i = 0; i < arr.length / 2 - 1; i++) {
      boolean isSorted = true;
      // 奇数轮，从左到右
      for (int j = rightSortBorder; j < leftSortBorder; j++) {
        if (arr[j] > arr[j + 1]) {
          tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          isSorted = false;
          lastExchangeIndex = j;
        }
      }
      leftSortBorder = lastExchangeIndex;
      if (isSorted) {
        break;
      }
      isSorted = true;
      // 偶数轮
      for (int j = leftSortBorder; j > rightSortBorder; j--) {
        if (arr[j] < arr[j - 1]) {
          tmp = arr[j];
          arr[j] = arr[j - 1];
          arr[j - 1] = tmp;
          isSorted = false;
          lastExchangeIndex = j;
        }
      }
      rightSortBorder = lastExchangeIndex;
      if (isSorted) {
        break;
      }
    }
  }
```

## 参考

- [十大排序算法 - 菜鸟教程](https://www.runoob.com/w3cnote/ten-sorting-algorithm.html)
- [第四章 - 排序算法 - 漫画算法](#)
