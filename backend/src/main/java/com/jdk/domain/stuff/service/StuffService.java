package com.jdk.domain.stuff.service;

import com.jdk.domain.child.entity.Child;
import com.jdk.domain.child.repository.ChildRepository;
import com.jdk.domain.stuff.dto.request.CreateAndDeleteChildStuffRequest;
import com.jdk.domain.stuff.dto.request.GetChildStuffRequest;
import com.jdk.domain.stuff.dto.response.ChildStuffInfo;
import com.jdk.domain.stuff.dto.response.GetAndDeleteChildStuffResponse;
import com.jdk.domain.stuff.entity.ChildStuff;
import com.jdk.domain.stuff.entity.ChildStuffId;
import com.jdk.domain.stuff.entity.Stuff;
import com.jdk.domain.stuff.repository.ChildStuffRepository;
import com.jdk.domain.stuff.repository.StuffRepository;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StuffService {
    private final StuffRepository stuffRepository;
    private final ChildStuffRepository childStuffRepository;
    private final ChildRepository childRepository;

    @Transactional
    public MessageOnlyResponse createChildStuff(CreateAndDeleteChildStuffRequest createAndDeleteChildStuffRequest){
        Child child = childRepository.findByChildName(createAndDeleteChildStuffRequest.getChildName())
                .orElseThrow(() -> new IllegalArgumentException("Wrong Child Name"));

        Arrays.stream(createAndDeleteChildStuffRequest.getStuffName()).forEach(name -> {
            Stuff stuff = stuffRepository.findByStuffName(name)
                    .orElseGet(()->
                            stuffRepository.save(
                                    Stuff.builder().stuffName(name).build()
                            ));

            ChildStuffId id = new ChildStuffId();
            id.setChildId(child.getId());
            id.setStuffId(stuff.getId());

            boolean exists = childStuffRepository.existsById(id);
            if (!exists) {
                ChildStuff childStuff = new ChildStuff();
                childStuff.setId(id);
                childStuff.setChild(child);
                childStuff.setStuff(stuff);

                childStuffRepository.save(childStuff);
            }
        });

        return MessageOnlyResponse.builder().message("Success Create Child-Stuff").build();
    }

    @Transactional(readOnly = true)
    public GetAndDeleteChildStuffResponse getChildStuff(GetChildStuffRequest getChildStuffRequest){
        Child child = childRepository.findByChildName(getChildStuffRequest.getChildName())
                .orElseThrow(() -> new IllegalArgumentException("Wrong Child Name"));

        return getGetAndDeleteChildStuffResponse(child);

    }

    @Transactional
    public GetAndDeleteChildStuffResponse deleteChildStuff(CreateAndDeleteChildStuffRequest createAndDeleteChildStuffRequest){
        Child child = childRepository.findByChildName(createAndDeleteChildStuffRequest.getChildName())
                .orElseThrow(() -> new IllegalArgumentException("Wrong Child Name"));

        List<ChildStuff> childStuffList = childStuffRepository.findAllByChild(child);

        Set<String> namesToDelete = Arrays.stream(createAndDeleteChildStuffRequest.getStuffName()).collect(Collectors.toSet());

        List<ChildStuff> toDelete = childStuffList.stream()
                .filter(cs -> namesToDelete.contains(cs.getStuff().getStuffName()))
                .collect(Collectors.toList());

        childStuffRepository.deleteAll(toDelete);

        return getGetAndDeleteChildStuffResponse(child);
    }

    private GetAndDeleteChildStuffResponse getGetAndDeleteChildStuffResponse(Child child) {
        List<ChildStuff> remainChildStuffList = childStuffRepository.findAllByChild(child);

        List<ChildStuffInfo> infoList = remainChildStuffList.stream()
                .map(cs -> ChildStuffInfo.builder()
                        .childName(cs.getChild().getChildName())
                        .stuffName(cs.getStuff().getStuffName())
                        .build())
                .collect(Collectors.toList());

        return GetAndDeleteChildStuffResponse.builder()
                .childStuffInfoList(infoList)
                .build();
    }
}
